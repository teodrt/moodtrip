'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { generateImages, generateSummary, extractPalette, generateTags } from '@/lib/ai'
import { downloadAndSaveImages, checkImagesExist, getExistingImageUrls } from '@/lib/file-utils'
import { onNewIdea, onPromoteTrip } from '@/lib/notify'
import { trackIdeaCreated, trackMoodboardGenerated, trackVoteSubmitted, trackTripPromoted, trackCommentAdded } from '@/lib/analytics'

// Types
type BudgetLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type VoteValue = 'UP' | 'MAYBE' | 'DOWN'

interface CreateIdeaInput {
  groupSlug: string
  prompt: string
  budget?: BudgetLevel
  kids?: boolean
  month?: number
}

interface CreateIdeaResult {
  id: string
}

interface PromoteToTripResult {
  tripId: string
}

/**
 * Creates a new travel idea in the specified group
 */
export async function createIdea(input: CreateIdeaInput): Promise<CreateIdeaResult> {
  try {
    // Find the group by slug
    const group = await prisma.group.findUnique({
      where: { slug: input.groupSlug }
    })

    if (!group) {
      throw new Error(`Group with slug "${input.groupSlug}" not found`)
    }

    // For now, use a placeholder user ID - in real app this would come from auth
    const placeholderUserId = 'placeholder-user-id'

    // Create the idea
    const idea = await prisma.idea.create({
      data: {
        title: input.prompt.substring(0, 100), // Use first 100 chars as title
        prompt: input.prompt,
        groupId: group.id,
        authorId: placeholderUserId,
        budgetLevel: input.budget || null,
        monthHint: input.month || null,
        status: 'DRAFT',
        tags: [], // Will be populated by AI
        palette: undefined, // Will be generated
        summary: undefined // Will be generated
      }
    })

    // Generate moodboard asynchronously
    generateMoodboard(idea.id).catch(console.error)

    // Send notification for new idea
    onNewIdea(group.id, idea.id).catch(console.error)

    // Track analytics
    trackIdeaCreated(idea.id, group.id, {
      budget_level: input.budget,
      kids_friendly: input.kids,
      month_hint: input.month,
      group_slug: input.groupSlug
    })

    revalidatePath(`/g/${input.groupSlug}`)
    
    return { id: idea.id }
  } catch (error) {
    console.error('Error creating idea:', error)
    throw new Error('Failed to create idea')
  }
}

/**
 * Generates a moodboard for an idea (images, palette, summary)
 * Idempotent: skips regeneration if images already exist
 */
export async function generateMoodboard(ideaId: string): Promise<void> {
  try {
    // 1. Load idea (prompt)
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { images: true }
    })

    if (!idea) {
      throw new Error('Idea not found')
    }

    // Check if moodboard already exists (idempotency)
    if (idea.status === 'PUBLISHED' && idea.images.length > 0) {
      console.log(`Moodboard already exists for idea ${ideaId}, skipping regeneration`)
      return
    }

    // Check if images already exist on disk
    const imagesExist = await checkImagesExist(ideaId)
    let imageUrls: string[] = []
    let imageResult: { urls: string[]; provider: string; source: 'AI' | 'STOCK' } | null = null

    if (imagesExist) {
      // 2a. Use existing images if they exist
      console.log(`Using existing images for idea ${ideaId}`)
      imageUrls = await getExistingImageUrls(ideaId)
      
      // Get existing image data from database
      const existingImages = idea.images
      if (existingImages.length > 0) {
        imageResult = {
          urls: imageUrls,
          provider: existingImages[0].provider || 'Unknown',
          source: existingImages[0].source
        }
      }
    } else {
      // 2b. Generate new images using AI providers
      console.log(`Generating new images for idea ${ideaId}`)
      imageResult = await generateImages(idea.prompt)
      
      // Download and save images to public directory
      imageUrls = await downloadAndSaveImages(imageResult.urls, ideaId)
      
      // Create Image rows in database
      await Promise.all(
        imageUrls.map((url, index) =>
          prisma.image.create({
            data: {
              ideaId,
              url,
              source: imageResult!.source,
              provider: imageResult!.provider,
              order: index
            }
          })
        )
      )
    }

    // 3. Extract color palette from images
    console.log(`Extracting color palette for idea ${ideaId}`)
    const palette = await extractPalette(imageUrls)

    // 4. Generate AI summary
    console.log(`Generating AI summary for idea ${ideaId}`)
    const summary = await generateSummary(idea.prompt)
    
    // Generate tags
    console.log(`Generating tags for idea ${ideaId}`)
    const tags = await generateTags(idea.prompt)

    // 5. Update idea status and generated content
    await prisma.idea.update({
      where: { id: ideaId },
      data: {
        status: 'PUBLISHED',
        palette,
        summary,
        tags
      }
    })

    // Track analytics
    trackMoodboardGenerated(ideaId, {
      image_count: imageUrls.length,
      palette_colors: palette,
      group_id: idea.groupId
    })

    console.log(`Moodboard generation completed for idea ${ideaId}`)
    revalidatePath(`/i/${ideaId}`)
  } catch (error) {
    console.error('Error generating moodboard:', error)
    
    // Update idea status to indicate failure (keep as DRAFT)
    try {
      await prisma.idea.update({
        where: { id: ideaId },
        data: { status: 'DRAFT' }
      })
    } catch (updateError) {
      console.error('Failed to update idea status to DRAFT:', updateError)
    }
    
    throw new Error('Failed to generate moodboard')
  }
}

/**
 * Votes on an idea (up, maybe, or down)
 */
export async function voteIdea(ideaId: string, value: VoteValue): Promise<void> {
  try {
    // For now, use a placeholder user ID - in real app this would come from auth
    const placeholderUserId = 'placeholder-user-id'

    // Upsert vote (update if exists, create if not)
    await prisma.vote.upsert({
      where: {
        ideaId_userId: {
          ideaId,
          userId: placeholderUserId
        }
      },
      update: {
        value
      },
      create: {
        ideaId,
        userId: placeholderUserId,
        value
      }
    })

    // Track analytics
    trackVoteSubmitted(ideaId, value, 'placeholder-group-id')

    revalidatePath(`/i/${ideaId}`)
  } catch (error) {
    console.error('Error voting on idea:', error)
    throw new Error('Failed to vote on idea')
  }
}

/**
 * Adds a comment to an idea
 */
export async function commentIdea(ideaId: string, body: string): Promise<void> {
  try {
    // For now, use a placeholder user ID - in real app this would come from auth
    const placeholderUserId = 'placeholder-user-id'

    await prisma.comment.create({
      data: {
        ideaId,
        authorId: placeholderUserId,
        body
      }
    })

    // Track analytics
    trackCommentAdded(ideaId, 'placeholder-group-id')

    revalidatePath(`/i/${ideaId}`)
  } catch (error) {
    console.error('Error adding comment:', error)
    throw new Error('Failed to add comment')
  }
}

/**
 * Promotes an idea to a trip by creating a trip board
 */
export async function promoteToTrip(ideaId: string): Promise<PromoteToTripResult> {
  try {
    // Get the idea with its group
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { group: true }
    })

    if (!idea) {
      throw new Error('Idea not found')
    }

    // Create the trip
    const trip = await prisma.trip.create({
      data: {
        groupId: idea.groupId,
        ideaId: idea.id,
        title: idea.title
      }
    })

    // Create some initial tasks for the trip
    const initialTasks = [
      {
        title: 'Research and book flights',
        status: 'TODO' as const
      },
      {
        title: 'Find accommodation',
        status: 'TODO' as const
      },
      {
        title: 'Plan daily itinerary',
        status: 'TODO' as const
      },
      {
        title: 'Book activities and tours',
        status: 'TODO' as const
      }
    ]

    await Promise.all(
      initialTasks.map(task =>
        prisma.task.create({
          data: {
            tripId: trip.id,
            title: task.title,
            status: task.status
          }
        })
      )
    )

    // Send notification for trip promotion
    onPromoteTrip(idea.groupId, trip.id).catch(console.error)

    // Track analytics
    trackTripPromoted(idea.id, trip.id, idea.groupId)

    revalidatePath(`/g/${idea.group.slug}`)
    revalidatePath(`/t/${trip.id}`)

    return { tripId: trip.id }
  } catch (error) {
    console.error('Error promoting idea to trip:', error)
    throw new Error('Failed to promote idea to trip')
  }
}

/**
 * Fetches ideas for a group by slug
 */
export async function getIdeasByGroupSlug(groupSlug: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { slug: groupSlug }
    })

    if (!group) {
      throw new Error(`Group with slug "${groupSlug}" not found`)
    }

    const ideas = await prisma.idea.findMany({
      where: { 
        groupId: group.id,
        status: 'PUBLISHED'
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1 // Only get the first image for cover
        },
        author: {
          select: {
            name: true,
            avatarUrl: true
          }
        },
        votes: {
          select: {
            value: true
          }
        },
        comments: {
          select: {
            id: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data for the component
    return Promise.all(ideas.map(async idea => {
      // Count votes by type
      const voteCounts = idea.votes.reduce((acc, vote) => {
        if (vote.value === 'UP') acc.up++
        else if (vote.value === 'MAYBE') acc.maybe++
        else if (vote.value === 'DOWN') acc.down++
        return acc
      }, { up: 0, maybe: 0, down: 0 })

      // Calculate group fit if monthHint is set
      const groupFit = idea.monthHint ? await calculateGroupFit(idea.id) : null

      return {
        id: idea.id,
        title: idea.title,
        tags: idea.tags || [],
        coverImage: idea.images[0]?.url || '/placeholder-image.svg',
        votes: voteCounts,
        comments: idea.comments.length,
        author: {
          name: idea.author.name || 'Anonymous',
          avatar: idea.author.avatarUrl
        },
        groupFit
      }
    }))
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return []
  }
}

/**
 * Fetches idea details by ID
 */
export async function getIdeaById(ideaId: string) {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        author: {
          select: {
            name: true,
            avatarUrl: true
          }
        },
        votes: {
          select: {
            value: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        group: {
          select: {
            slug: true
          }
        }
      }
    })

    if (!idea) {
      return null
    }

    // Count votes by type
    const voteCounts = idea.votes.reduce((acc, vote) => {
      if (vote.value === 'UP') acc.up++
      else if (vote.value === 'MAYBE') acc.maybe++
      else if (vote.value === 'DOWN') acc.down++
      return acc
    }, { up: 0, maybe: 0, down: 0 })

    return {
      id: idea.id,
      title: idea.title,
      prompt: idea.prompt,
      status: idea.status,
      tags: idea.tags || [],
      palette: idea.palette || [],
      summary: idea.summary,
      budgetLevel: idea.budgetLevel,
      monthHint: idea.monthHint,
      kidsFriendly: idea.kidsFriendly,
      createdAt: idea.createdAt,
      images: idea.images.map(img => ({
        id: img.id,
        url: img.url,
        source: img.source,
        provider: img.provider
      })),
      votes: voteCounts,
      comments: idea.comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt,
        author: {
          name: comment.author.name || 'Anonymous',
          avatar: comment.author.avatarUrl
        }
      })),
      author: {
        name: idea.author.name || 'Anonymous',
        avatar: idea.author.avatarUrl
      },
      group: {
        slug: idea.group.slug
      }
    }
  } catch (error) {
    console.error('Error fetching idea:', error)
    return null
  }
}

/**
 * Fetches trip details with tasks by ID
 */
export async function getTripById(tripId: string) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        idea: {
          select: {
            title: true,
            prompt: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        },
        group: {
          select: {
            slug: true,
            name: true
          }
        },
        tasks: {
          include: {
            owner: {
              select: {
                name: true,
                avatarUrl: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!trip) {
      return null
    }

    return {
      id: trip.id,
      title: trip.title,
      createdAt: trip.createdAt,
      idea: {
        title: trip.idea.title,
        prompt: trip.idea.prompt,
        coverImage: trip.idea.images[0]?.url || '/placeholder-image.svg'
      },
      group: {
        slug: trip.group.slug,
        name: trip.group.name
      },
      tasks: trip.tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        owner: task.owner ? {
          name: task.owner.name || 'Anonymous',
          avatar: task.owner.avatarUrl
        } : null,
        createdAt: task.createdAt
      }))
    }
  } catch (error) {
    console.error('Error fetching trip:', error)
    return null
  }
}

/**
 * Creates a new task for a trip
 */
export async function createTask(tripId: string, title: string, status: 'TODO' | 'DOING' | 'DONE' = 'TODO') {
  try {
    const task = await prisma.task.create({
      data: {
        tripId,
        title,
        status,
        ownerId: 'clx012345000008l400000000' // Placeholder user ID
      },
      include: {
        owner: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    revalidatePath(`/t/${tripId}`)
    
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      owner: task.owner ? {
        name: task.owner.name || 'Anonymous',
        avatar: task.owner.avatarUrl
      } : null,
      createdAt: task.createdAt
    }
  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }
}

/**
 * Updates the status of a task
 */
export async function updateTaskStatus(taskId: string, status: 'TODO' | 'DOING' | 'DONE') {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status }
    })

    revalidatePath(`/t/${taskId}`) // This will revalidate the trip page
  } catch (error) {
    console.error('Error updating task status:', error)
    throw new Error('Failed to update task status')
  }
}

/**
 * Gets group availability data for a group
 */
export async function getGroupAvailability(groupSlug: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { slug: groupSlug }
    })

    if (!group) {
      return null
    }

    // Get all availability records for this group
    const availabilityRecords = await prisma.availability.findMany({
      where: { groupId: group.id },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    // Get current user's availability (placeholder for now)
    const placeholderUserId = 'clx012345000008l400000000'
    const userAvailability = availabilityRecords
      .filter(record => record.userId === placeholderUserId)
      .map(record => ({
        month: record.month,
        score: record.score
      }))

    // Calculate group averages by month
    const groupAvailability = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1
      const monthRecords = availabilityRecords.filter(record => record.month === month)
      
      if (monthRecords.length === 0) {
        return {
          month,
          averageScore: 0,
          participantCount: 0
        }
      }

      const averageScore = monthRecords.reduce((sum, record) => sum + record.score, 0) / monthRecords.length
      
      return {
        month,
        averageScore,
        participantCount: monthRecords.length
      }
    })

    return {
      groupId: group.id,
      groupName: group.name,
      userAvailability,
      groupAvailability
    }
  } catch (error) {
    console.error('Error fetching group availability:', error)
    return null
  }
}

/**
 * Updates user availability for a specific month
 */
export async function updateAvailability(groupId: string, month: number, score: number) {
  try {
    const placeholderUserId = 'clx012345000008l400000000'

    await prisma.availability.upsert({
      where: {
        userId_groupId_month: {
          userId: placeholderUserId,
          groupId,
          month
        }
      },
      update: {
        score
      },
      create: {
        userId: placeholderUserId,
        groupId,
        month,
        score
      }
    })

    revalidatePath(`/g/${groupId}/availability`)
  } catch (error) {
    console.error('Error updating availability:', error)
    throw new Error('Failed to update availability')
  }
}

/**
 * Calculates group fit score for an idea based on monthHint
 */
export async function calculateGroupFit(ideaId: string): Promise<number | null> {
  try {
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        group: true
      }
    })

    if (!idea || !idea.monthHint) {
      return null
    }

    // Get availability records for the group
    const availabilityRecords = await prisma.availability.findMany({
      where: { groupId: idea.groupId }
    })

    if (availabilityRecords.length === 0) {
      return null
    }

    // Calculate weighted average for monthHint ± 1
    const targetMonth = idea.monthHint
    const months = [
      { month: targetMonth === 1 ? 12 : targetMonth - 1, weight: 0.5 },
      { month: targetMonth, weight: 1.0 },
      { month: targetMonth === 12 ? 1 : targetMonth + 1, weight: 0.5 }
    ]

    let totalScore = 0
    let totalWeight = 0

    for (const { month, weight } of months) {
      const monthRecords = availabilityRecords.filter(record => record.month === month)
      if (monthRecords.length > 0) {
        const monthAverage = monthRecords.reduce((sum, record) => sum + record.score, 0) / monthRecords.length
        totalScore += monthAverage * weight
        totalWeight += weight
      }
    }

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : null
  } catch (error) {
    console.error('Error calculating group fit:', error)
    return null
  }
}
