'use client'

import { prisma } from '@/lib/prisma'

interface UserPreferences {
  budgetLevel?: 'LOW' | 'MEDIUM' | 'HIGH'
  preferredMonths?: number[]
  familyFriendly?: boolean
  pastVotes?: Array<{ ideaId: string; voteType: 'UP' | 'MAYBE' | 'DOWN' }>
  pastIdeas?: Array<{ tags: string[]; budgetLevel?: string }>
}

interface AIRecommendation {
  ideaId: string
  score: number
  reasons: string[]
  confidence: number
}

export class AdvancedAI {
  // Smart recommendations based on user behavior
  static async getPersonalizedRecommendations(
    userId: string, 
    groupId: string, 
    limit: number = 5
  ): Promise<AIRecommendation[]> {
    try {
      // Get user preferences and history
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          votes: {
            include: { idea: true }
          },
          ideas: true
        }
      })

      if (!user) return []

      // Get all ideas in the group
      const groupIdeas = await prisma.idea.findMany({
        where: { groupId },
        include: {
          votes: true,
          images: true,
          author: true
        }
      })

      // Calculate personalized scores
      const recommendations = groupIdeas.map(idea => {
        const score = this.calculatePersonalizedScore(idea, user)
        return {
          ideaId: idea.id,
          score: score.total,
          reasons: score.reasons,
          confidence: score.confidence
        }
      })

      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting personalized recommendations:', error)
      return []
    }
  }

  private static calculatePersonalizedScore(idea: any, user: any) {
    let score = 0
    const reasons: string[] = []
    let confidence = 0.5

    // Budget preference matching
    if (idea.budgetLevel && user.preferences?.budgetLevel) {
      if (idea.budgetLevel === user.preferences.budgetLevel) {
        score += 20
        reasons.push('Matches your budget preference')
        confidence += 0.1
      }
    }

    // Family-friendly preference
    if (idea.kids !== undefined && user.preferences?.familyFriendly !== undefined) {
      if (idea.kids === user.preferences.familyFriendly) {
        score += 15
        reasons.push('Matches your family-friendly preference')
        confidence += 0.1
      }
    }

    // Tag similarity with past positive votes
    const positiveVotes = user.votes.filter((v: any) => v.value === 'UP')
    if (positiveVotes.length > 0) {
      const positiveTags = positiveVotes.flatMap((v: any) => v.idea.tags || [])
      const commonTags = idea.tags?.filter((tag: string) => positiveTags.includes(tag)) || []
      
      if (commonTags.length > 0) {
        score += commonTags.length * 10
        reasons.push(`Similar to ideas you liked (${commonTags.join(', ')})`)
        confidence += 0.2
      }
    }

    // Author preference (if user tends to like ideas from certain authors)
    const authorVotes = user.votes.filter((v: any) => v.idea.authorId === idea.authorId)
    const positiveAuthorVotes = authorVotes.filter((v: any) => v.value === 'UP')
    
    if (authorVotes.length > 0) {
      const authorScore = (positiveAuthorVotes.length / authorVotes.length) * 10
      score += authorScore
      if (authorScore > 5) {
        reasons.push('From an author whose ideas you often like')
        confidence += 0.1
      }
    }

    // Recency bonus
    const daysSinceCreated = (Date.now() - new Date(idea.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated < 7) {
      score += 5
      reasons.push('Recently created')
    }

    // Popularity bonus
    const totalVotes = idea.votes.length
    const positiveVotes = idea.votes.filter((v: any) => v.value === 'UP').length
    const popularityScore = totalVotes > 0 ? (positiveVotes / totalVotes) * 15 : 0
    
    if (popularityScore > 10) {
      score += popularityScore
      reasons.push('Popular with the group')
      confidence += 0.1
    }

    return {
      total: Math.min(score, 100), // Cap at 100
      reasons,
      confidence: Math.min(confidence, 1)
    }
  }

  // Sentiment analysis for comments
  static analyzeCommentSentiment(comment: string): {
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number
    keywords: string[]
  } {
    const positiveWords = ['love', 'amazing', 'great', 'awesome', 'fantastic', 'perfect', 'excellent', 'wonderful', 'beautiful', 'incredible']
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'horrible', 'disappointing', 'worst', 'ugly', 'boring', 'stupid']
    
    const words = comment.toLowerCase().split(/\s+/)
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    let confidence = 0.5
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
      confidence = Math.min(0.5 + (positiveCount - negativeCount) * 0.1, 1)
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
      confidence = Math.min(0.5 + (negativeCount - positiveCount) * 0.1, 1)
    }
    
    const keywords = words.filter(word => 
      positiveWords.includes(word) || negativeWords.includes(word)
    )
    
    return { sentiment, confidence, keywords }
  }

  // Smart group fit calculation
  static async calculateAdvancedGroupFit(ideaId: string, groupId: string): Promise<{
    score: number
    factors: Array<{ name: string; impact: number; description: string }>
  }> {
    try {
      const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
        include: {
          votes: true,
          group: {
            include: {
              members: {
                include: {
                  votes: true,
                  availability: true
                }
              }
            }
          }
        }
      })

      if (!idea) return { score: 0, factors: [] }

      const factors: Array<{ name: string; impact: number; description: string }> = []
      let totalScore = 0

      // Availability factor
      const currentMonth = new Date().getMonth() + 1
      const availableMembers = idea.group.members.filter(member => 
        member.availability.some(av => av.month === currentMonth && av.score >= 7)
      )
      
      const availabilityScore = (availableMembers.length / idea.group.members.length) * 30
      totalScore += availabilityScore
      factors.push({
        name: 'Availability',
        impact: availabilityScore,
        description: `${availableMembers.length}/${idea.group.members.length} members available this month`
      })

      // Budget consensus
      const memberBudgets = idea.group.members.map(member => member.preferences?.budgetLevel).filter(Boolean)
      if (memberBudgets.length > 0) {
        const budgetConsensus = memberBudgets.filter(budget => budget === idea.budgetLevel).length / memberBudgets.length
        const budgetScore = budgetConsensus * 25
        totalScore += budgetScore
        factors.push({
          name: 'Budget Consensus',
          impact: budgetScore,
          description: `${Math.round(budgetConsensus * 100)}% of members prefer this budget level`
        })
      }

      // Family-friendly consensus
      if (idea.kids !== undefined) {
        const familyFriendlyMembers = idea.group.members.filter(member => 
          member.preferences?.familyFriendly === idea.kids
        )
        const familyScore = (familyFriendlyMembers.length / idea.group.members.length) * 20
        totalScore += familyScore
        factors.push({
          name: 'Family Preferences',
          impact: familyScore,
          description: `${familyFriendlyMembers.length}/${idea.group.members.length} members have matching family preferences`
        })
      }

      // Voting momentum
      const recentVotes = idea.votes.filter(vote => {
        const voteAge = Date.now() - new Date(vote.createdAt).getTime()
        return voteAge < 24 * 60 * 60 * 1000 // Last 24 hours
      })
      
      if (recentVotes.length > 0) {
        const positiveRecentVotes = recentVotes.filter(vote => vote.value === 'UP').length
        const momentumScore = (positiveRecentVotes / recentVotes.length) * 15
        totalScore += momentumScore
        factors.push({
          name: 'Recent Momentum',
          impact: momentumScore,
          description: `${Math.round((positiveRecentVotes / recentVotes.length) * 100)}% positive votes in last 24h`
        })
      }

      // Tag diversity
      const allGroupTags = idea.group.members.flatMap(member => 
        member.ideas.flatMap(idea => idea.tags || [])
      )
      const uniqueTags = [...new Set(allGroupTags)]
      const ideaTagDiversity = idea.tags?.filter(tag => uniqueTags.includes(tag)).length || 0
      const diversityScore = Math.min(ideaTagDiversity * 5, 10)
      totalScore += diversityScore
      factors.push({
        name: 'Tag Diversity',
        impact: diversityScore,
        description: `Matches ${ideaTagDiversity} popular group interests`
      })

      return {
        score: Math.min(totalScore, 100),
        factors
      }
    } catch (error) {
      console.error('Error calculating advanced group fit:', error)
      return { score: 0, factors: [] }
    }
  }
}
