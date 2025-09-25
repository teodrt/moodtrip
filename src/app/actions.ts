'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { generateImages, generateSummary, extractPalette, generateTags } from '@/lib/ai'
import { downloadAndSaveImages, checkImagesExist, getExistingImageUrls } from '@/lib/file-utils'
import { onNewIdea, onPromoteTrip } from '@/lib/notify'
import { createIdeaSchema, voteIdeaSchema, commentIdeaSchema, updateAvailabilitySchema, validateInput, type CreateIdeaInput, type VoteIdeaInput, type CommentIdeaInput, type UpdateAvailabilityInput } from '@/lib/validations'
import { auth } from '@/lib/auth'

// Types
type BudgetLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type VoteValue = 'UP' | 'MAYBE' | 'DOWN'

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
    // Validate input
    const validatedInput = validateInput(createIdeaSchema, input)
    
    // Get authenticated user - with fallback for demo purposes
    let userId: string
    try {
      const session = await auth()
      if (session?.user?.id) {
        userId = session.user.id
      } else {
        // Fallback: use a demo user ID for development
        const demoUser = await prisma.user.findFirst({
          where: { email: 'demo@moodtrip.com' }
        })
        
        if (demoUser) {
          userId = demoUser.id
        } else {
          // Create demo user if doesn't exist
          const newDemoUser = await prisma.user.create({
            data: {
              email: 'demo@moodtrip.com',
              name: 'Demo User',
            }
          })
          userId = newDemoUser.id
        }
      }
    } catch (authError) {
      console.log('Auth error, using demo user:', authError)
      // Fallback: use a demo user ID for development
      const demoUser = await prisma.user.findFirst({
        where: { email: 'demo@moodtrip.com' }
      })
      
      if (demoUser) {
        userId = demoUser.id
      } else {
        // Create demo user if doesn't exist
        const newDemoUser = await prisma.user.create({
          data: {
            email: 'demo@moodtrip.com',
            name: 'Demo User',
          }
        })
        userId = newDemoUser.id
      }
    }
    
    // Find the group by slug
    const group = await prisma.group.findUnique({
      where: { slug: validatedInput.groupSlug }
    })

    if (!group) {
      throw new Error(`Group with slug "${validatedInput.groupSlug}" not found`)
    }

    // Create the idea
    const idea = await prisma.idea.create({
      data: {
        title: validatedInput.prompt.substring(0, 100), // Use first 100 chars as title
        prompt: validatedInput.prompt,
        groupId: group.id,
        authorId: userId,
        budgetLevel: validatedInput.budget || null,
        monthHint: validatedInput.month || null,
        status: 'DRAFT',
        tags: [], // Will be populated by AI
        palette: undefined, // Will be generated
        summary: undefined // Will be generated
      }
    })

    // Generate moodboard asynchronously (with better error handling)
    console.log('🚀 Starting moodboard generation for idea:', idea.id)
    Promise.resolve().then(async () => {
      try {
        await generateMoodboard(idea.id)
        console.log('✅ Moodboard generation completed for idea:', idea.id)
      } catch (error) {
        console.error('❌ Error generating moodboard for idea', idea.id, ':', error)
        console.error('Full error stack:', error.stack)
      }
    })

    // Send notification for new idea
    onNewIdea(group.id, idea.id).catch(console.error)

    // Track analytics (server-side safe)
    console.log('Idea created:', idea.id, 'for group:', group.id)

    revalidatePath(`/g/${validatedInput.groupSlug}`)
    
    return { id: idea.id }
  } catch (error) {
    console.error('Error creating idea:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Validation error')) {
        throw error // Re-throw validation errors as-is
      }
      if (error.message.includes('Group with slug')) {
        throw new Error(`Group not found: ${error.message}`)
      }
      if (error.message.includes('Unique constraint')) {
        throw new Error('An idea with this content already exists')
      }
    }
    
    // Generic fallback
    throw new Error('Failed to create idea. Please try again.')
  }
}

/**
 * Generates a moodboard for an idea (images, palette, summary)
 * Idempotent: skips regeneration if images already exist
 */
export async function generateMoodboard(ideaId: string): Promise<void> {
  console.log('🎨 Starting moodboard generation for idea:', ideaId)
  try {
    // 1. Load idea (prompt)
    console.log('📋 Loading idea from database...')
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { images: true }
    })

    if (!idea) {
      throw new Error('Idea not found')
    }
    
    console.log('📋 Idea loaded:', { id: idea.id, title: idea.title, status: idea.status })

    // Check if moodboard already exists (idempotency)
    if (idea.status === 'PUBLISHED' && idea.images.length > 0) {
      console.log(`Moodboard already exists for idea ${ideaId}, skipping regeneration`)
      return
    }

    // 2. Generate images using AI with emotional context
    console.log('🖼️ Generating images for prompt:', idea.prompt)
    const imageResult = await generateImages(idea.prompt, {
      location: idea.prompt.toLowerCase().includes('switzerland') ? 'switzerland' : 
                idea.prompt.toLowerCase().includes('norway') ? 'norway' :
                idea.prompt.toLowerCase().includes('iceland') ? 'iceland' :
                idea.prompt.toLowerCase().includes('japan') ? 'japan' :
                idea.prompt.toLowerCase().includes('mexico') ? 'mexico' :
                idea.prompt.toLowerCase().includes('italy') ? 'italy' : 'travel',
      month: idea.monthHint || 6,
      budgetLevel: idea.budgetLevel || 'MEDIUM',
      groupType: idea.kidsFriendly ? 'family' : 'friends',
      activity: idea.prompt.toLowerCase().includes('ski') ? 'skiing' :
                idea.prompt.toLowerCase().includes('beach') ? 'beach' :
                idea.prompt.toLowerCase().includes('hiking') ? 'hiking' :
                idea.prompt.toLowerCase().includes('dining') ? 'dining' :
                idea.prompt.toLowerCase().includes('culture') ? 'culture' : 'exploring',
      mood: idea.prompt.toLowerCase().includes('relax') ? 'relaxation' :
            idea.prompt.toLowerCase().includes('adventure') ? 'adventure' :
            idea.prompt.toLowerCase().includes('culture') ? 'culture' :
            idea.prompt.toLowerCase().includes('luxury') ? 'luxury' : 'relaxation'
    })
    console.log(`🖼️ Generated ${imageResult.urls.length} images using ${imageResult.provider}`)

    // 3. Download and save images locally
    const savedImages = await downloadAndSaveImages(imageResult.urls, ideaId)

    // 4. Generate summary and tags using AI
    const [summary, tags] = await Promise.all([
      generateSummary(idea.prompt),
      generateTags(idea.prompt)
    ])

    // 5. Extract color palette from first image
    const palette = savedImages && savedImages.length > 0 ? await extractPalette(savedImages) : []

    // 6. Save images to database
    if (savedImages.length > 0) {
      console.log('Saving images to database:', savedImages)
      try {
        await prisma.image.createMany({
          data: savedImages.map((url, index) => ({
            ideaId,
            url,
            source: imageResult.source,
            provider: imageResult.provider,
            order: index
          }))
        })
        console.log(`Successfully saved ${savedImages.length} images to database`)
      } catch (error) {
        console.error('Error saving images to database:', error)
        throw error
      }
    } else {
      console.warn('No images to save to database')
    }

    // 7. Update idea with generated content
    await prisma.idea.update({
      where: { id: ideaId },
      data: {
        status: 'PUBLISHED',
        summary,
        tags,
        palette
      }
    })

    console.log(`Moodboard generated successfully for idea ${ideaId}`)
  } catch (error) {
    console.error('❌ Error generating moodboard:', error)
    // Update idea status to FAILED if moodboard generation fails
    await prisma.idea.update({
      where: { id: ideaId },
      data: { status: 'DRAFT' }
    }).catch(console.error)
    // Don't throw - this is async and shouldn't break the main flow
  }
}

/**
 * Votes on an idea
 */
export async function voteIdea(ideaId: string, voteType: VoteValue): Promise<void> {
  try {
    // Validate input
    const validatedInput = validateInput(voteIdeaSchema, { ideaId, voteType })
    
    // Get authenticated user - with fallback for demo purposes
    let userId: string
    try {
      const session = await auth()
      if (session?.user?.id) {
        userId = session.user.id
      } else {
        // Fallback: use a demo user ID for development
        const demoUser = await prisma.user.findFirst({
          where: { email: 'demo@moodtrip.com' }
        })
        userId = demoUser?.id || 'demo-user-id'
      }
    } catch (authError) {
      console.log('Auth error in voteIdea, using demo user:', authError)
      // Fallback: use a demo user ID for development
      const demoUser = await prisma.user.findFirst({
        where: { email: 'demo@moodtrip.com' }
      })
      userId = demoUser?.id || 'demo-user-id'
    }

    await prisma.vote.upsert({
      where: {
        userId_ideaId: {
          userId: userId,
          ideaId: validatedInput.ideaId
        }
      },
      update: {
        value: validatedInput.voteType
      },
      create: {
        userId: userId,
        ideaId: validatedInput.ideaId,
        value: validatedInput.voteType
      }
    })

    revalidatePath(`/i/${validatedInput.ideaId}`)
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
    const session = await auth()
    const userId = session?.user?.id || 'cmfva3td500006ermy5186aw7'

    await prisma.comment.create({
      data: {
        ideaId,
        authorId: userId,
        body
      }
    })

    revalidatePath(`/i/${ideaId}`)
  } catch (error) {
    console.error('Error commenting on idea:', error)
    throw new Error('Failed to comment on idea')
  }
}

/**
 * Promotes an idea to a trip
 */
export async function promoteToTrip(ideaId: string): Promise<PromoteToTripResult> {
  try {
    const session = await auth()
    const userId = session?.user?.id || 'cmfva3td500006ermy5186aw7'

    // Get the idea
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
        ideaId,
        groupId: idea.groupId,
        createdById: userId,
        status: 'PLANNING'
      }
    })

    // Send notification
    onPromoteTrip(idea.groupId, trip.id).catch(console.error)

    revalidatePath(`/t/${trip.id}`)
    revalidatePath(`/g/${idea.group.slug}`)

    return { tripId: trip.id }
  } catch (error) {
    console.error('Error promoting idea to trip:', error)
    throw new Error('Failed to promote idea to trip')
  }
}

/**
 * Gets an idea by ID with all related data
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
            id: true,
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
            slug: true,
            name: true
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
        avatarUrl: idea.author.avatarUrl
      },
      group: idea.group
    }
  } catch (error) {
    console.error('Error fetching idea:', error)
    return null
  }
}

/**
 * Gets a trip by ID with all related data
 */
export async function getTripById(tripId: string) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        idea: {
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
              select: {
                id: true
              }
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
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!trip) {
      return null
    }

    // Count votes by type
    const voteCounts = trip.idea.votes.reduce((acc, vote) => {
      if (vote.value === 'UP') acc.up++
      else if (vote.value === 'MAYBE') acc.maybe++
      else if (vote.value === 'DOWN') acc.down++
      return acc
    }, { up: 0, maybe: 0, down: 0 })

    return {
      id: trip.id,
      status: trip.status,
      createdAt: trip.createdAt,
      idea: {
        id: trip.idea.id,
        title: trip.idea.title,
        prompt: trip.idea.prompt,
        status: trip.idea.status,
        tags: trip.idea.tags || [],
        palette: trip.idea.palette || [],
        summary: trip.idea.summary,
        budgetLevel: trip.idea.budgetLevel,
        monthHint: trip.idea.monthHint,
        createdAt: trip.idea.createdAt,
        images: trip.idea.images.map(img => ({
          id: img.id,
          url: img.url,
          source: img.source,
          provider: img.provider
        })),
        votes: voteCounts,
        commentCount: trip.idea.comments.length,
        author: {
          name: trip.idea.author.name || 'Anonymous',
          avatarUrl: trip.idea.author.avatarUrl
        }
      },
      group: trip.group,
      tasks: trip.tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        createdAt: task.createdAt
      }))
    }
  } catch (error) {
    console.error('Error fetching trip:', error)
    return null
  }
}

/**
 * Deletes an idea (only if user is the creator)
 */
export async function deleteIdea(ideaId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get authenticated user - with fallback for demo purposes
    let userId: string
    try {
      const session = await auth()
      if (session?.user?.id) {
        userId = session.user.id
      } else {
        // Fallback: use a demo user ID for development
        const demoUser = await prisma.user.findFirst({
          where: { email: 'demo@moodtrip.com' }
        })
        
        if (demoUser) {
          userId = demoUser.id
        } else {
          return { success: false, error: 'User not authenticated' }
        }
      }
    } catch (authError) {
      console.log('Auth error, using demo user:', authError)
      // Fallback: use a demo user ID for development
      const demoUser = await prisma.user.findFirst({
        where: { email: 'demo@moodtrip.com' }
      })
      
      if (demoUser) {
        userId = demoUser.id
      } else {
        return { success: false, error: 'User not authenticated' }
      }
    }

    // Check if the idea exists and if the user is the creator
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { authorId: true }
    })

    if (!idea) {
      return { success: false, error: 'Idea not found' }
    }

    if (idea.authorId !== userId) {
      return { success: false, error: 'You can only delete your own ideas' }
    }

    // Delete the idea (this will cascade delete related records)
    await prisma.idea.delete({
      where: { id: ideaId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting idea:', error)
    return { success: false, error: 'Failed to delete idea' }
  }
}

/**
 * Creates a new task for a trip
 */
export async function createTask(tripId: string, title: string, description?: string) {
  try {
    const session = await auth()
    const userId = session?.user?.id || 'cmfva3td500006ermy5186aw7'

    const task = await prisma.task.create({
      data: {
        tripId,
        title,
        description,
        createdById: userId
      }
    })

    revalidatePath(`/t/${tripId}`)
    return task
  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }
}

/**
 * Toggles task completion status
 */
export async function toggleTask(taskId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: !task.completed
      }
    })

    revalidatePath(`/t/${task.tripId}`)
  } catch (error) {
    console.error('Error toggling task:', error)
    throw new Error('Failed to toggle task')
  }
}

/**
 * Gets group availability data
 */
export async function getGroupAvailability(groupId: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return null
    }

    // Get all availability records for the group
    const availabilityRecords = await prisma.availability.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true
          }
        }
      }
    })

    // Group by user
    const userAvailability = availabilityRecords.reduce((acc, record) => {
      const userId = record.userId
      if (!acc[userId]) {
        acc[userId] = {
          user: record.user,
          availability: []
        }
      }
      acc[userId].availability.push({
        month: record.month,
        score: record.score
      })
      return acc
    }, {} as Record<string, { user: any; availability: Array<{ month: number; score: number }> }>)

    // Calculate group averages by month
    const groupAvailability = Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
      const monthRecords = availabilityRecords.filter(record => record.month === month)
      const averageScore = monthRecords.length > 0 
        ? monthRecords.reduce((sum, record) => sum + record.score, 0) / monthRecords.length 
        : 0
      
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
    const session = await auth()
    const userId = session?.user?.id || 'cmfva3td500006ermy5186aw7'

    await prisma.availability.upsert({
      where: {
        userId_groupId_month: {
          userId,
          groupId,
          month
        }
      },
      update: {
        score
      },
      create: {
        userId,
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
 * Fetches ideas by group slug
 */
export async function getIdeasByGroupSlug(groupSlug: string) {
  try {
    const group = await prisma.group.findUnique({
      where: { slug: groupSlug }
    })

    if (!group) {
      return []
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