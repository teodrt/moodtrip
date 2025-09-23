'use client'

import { prisma } from '@/lib/prisma'

interface AnalyticsEvent {
  type: 'page_view' | 'idea_created' | 'vote_cast' | 'comment_added' | 'search_performed' | 'filter_applied'
  userId?: string
  groupId?: string
  ideaId?: string
  metadata?: Record<string, any>
  timestamp?: Date
}

interface UserBehavior {
  totalIdeas: number
  totalVotes: number
  totalComments: number
  averageSessionDuration: number
  mostActiveHours: number[]
  preferredBudgetLevels: string[]
  favoriteTags: string[]
  engagementScore: number
}

interface GroupAnalytics {
  totalMembers: number
  totalIdeas: number
  averageVotesPerIdea: number
  mostPopularTags: Array<{ tag: string; count: number }>
  monthlyActivity: Array<{ month: string; ideas: number; votes: number }>
  topContributors: Array<{ userId: string; name: string; contributions: number }>
  engagementTrend: 'increasing' | 'decreasing' | 'stable'
}

export class AdvancedAnalytics {
  // Track user events
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await prisma.analyticsEvent.create({
        data: {
          type: event.type,
          userId: event.userId,
          groupId: event.groupId,
          ideaId: event.ideaId,
          metadata: event.metadata || {},
          timestamp: event.timestamp || new Date()
        }
      })
    } catch (error) {
      console.error('Error tracking analytics event:', error)
    }
  }

  // Get user behavior insights
  static async getUserBehavior(userId: string): Promise<UserBehavior> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          ideas: {
            include: { votes: true, comments: true }
          },
          votes: true,
          comments: true,
          analyticsEvents: {
            where: { type: 'page_view' },
            orderBy: { timestamp: 'desc' }
          }
        }
      })

      if (!user) {
        return {
          totalIdeas: 0,
          totalVotes: 0,
          totalComments: 0,
          averageSessionDuration: 0,
          mostActiveHours: [],
          preferredBudgetLevels: [],
          favoriteTags: [],
          engagementScore: 0
        }
      }

      // Calculate engagement score
      const ideas = user.ideas.length
      const votes = user.votes.length
      const comments = user.comments.length
      const engagementScore = Math.min((ideas * 10 + votes * 2 + comments * 5), 100)

      // Get most active hours
      const pageViews = user.analyticsEvents
      const hours = pageViews.map(event => new Date(event.timestamp).getHours())
      const hourCounts = hours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1
        return acc
      }, {} as Record<number, number>)
      
      const mostActiveHours = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour))

      // Get preferred budget levels
      const budgetLevels = user.ideas
        .map(idea => idea.budgetLevel)
        .filter(Boolean) as string[]
      const budgetCounts = budgetLevels.reduce((acc, budget) => {
        acc[budget] = (acc[budget] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const preferredBudgetLevels = Object.entries(budgetCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([budget]) => budget)

      // Get favorite tags
      const allTags = user.ideas.flatMap(idea => idea.tags || [])
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const favoriteTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag]) => tag)

      // Calculate average session duration (simplified)
      const sessions = this.calculateSessions(pageViews)
      const averageSessionDuration = sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length
        : 0

      return {
        totalIdeas: ideas,
        totalVotes: votes,
        totalComments: comments,
        averageSessionDuration,
        mostActiveHours,
        preferredBudgetLevels,
        favoriteTags,
        engagementScore
      }
    } catch (error) {
      console.error('Error getting user behavior:', error)
      return {
        totalIdeas: 0,
        totalVotes: 0,
        totalComments: 0,
        averageSessionDuration: 0,
        mostActiveHours: [],
        preferredBudgetLevels: [],
        favoriteTags: [],
        engagementScore: 0
      }
    }
  }

  // Get group analytics
  static async getGroupAnalytics(groupId: string): Promise<GroupAnalytics> {
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: {
            include: {
              ideas: {
                include: { votes: true, comments: true }
              },
              votes: true
            }
          },
          ideas: {
            include: { votes: true, comments: true }
          }
        }
      })

      if (!group) {
        return {
          totalMembers: 0,
          totalIdeas: 0,
          averageVotesPerIdea: 0,
          mostPopularTags: [],
          monthlyActivity: [],
          topContributors: [],
          engagementTrend: 'stable'
        }
      }

      const totalMembers = group.members.length
      const totalIdeas = group.ideas.length
      const totalVotes = group.ideas.reduce((sum, idea) => sum + idea.votes.length, 0)
      const averageVotesPerIdea = totalIdeas > 0 ? totalVotes / totalIdeas : 0

      // Get most popular tags
      const allTags = group.ideas.flatMap(idea => idea.tags || [])
      const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const mostPopularTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }))

      // Get monthly activity
      const monthlyActivity = this.calculateMonthlyActivity(group.ideas)

      // Get top contributors
      const contributors = group.members.map(member => ({
        userId: member.id,
        name: member.name || member.email,
        contributions: member.ideas.length + member.votes.length
      })).sort((a, b) => b.contributions - a.contributions).slice(0, 5)

      // Calculate engagement trend
      const recentMonths = monthlyActivity.slice(-3)
      const engagementTrend = this.calculateEngagementTrend(recentMonths)

      return {
        totalMembers,
        totalIdeas,
        averageVotesPerIdea,
        mostPopularTags,
        monthlyActivity,
        topContributors,
        engagementTrend
      }
    } catch (error) {
      console.error('Error getting group analytics:', error)
      return {
        totalMembers: 0,
        totalIdeas: 0,
        averageVotesPerIdea: 0,
        mostPopularTags: [],
        monthlyActivity: [],
        topContributors: [],
        engagementTrend: 'stable'
      }
    }
  }

  // Get real-time insights
  static async getRealTimeInsights(groupId: string): Promise<{
    activeUsers: number
    recentActivity: Array<{ type: string; description: string; timestamp: Date }>
    trendingIdeas: Array<{ ideaId: string; title: string; voteGrowth: number }>
  }> {
    try {
      const recentEvents = await prisma.analyticsEvent.findMany({
        where: {
          groupId,
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 50
      })

      const activeUsers = new Set(recentEvents.map(event => event.userId).filter(Boolean)).size

      const recentActivity = recentEvents.slice(0, 10).map(event => ({
        type: event.type,
        description: this.getEventDescription(event),
        timestamp: event.timestamp
      }))

      // Get trending ideas (ideas with most votes in last 24h)
      const trendingIdeas = await prisma.idea.findMany({
        where: {
          groupId,
          votes: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
              }
            }
          }
        },
        include: {
          votes: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
              }
            }
          }
        },
        orderBy: {
          votes: {
            _count: 'desc'
          }
        },
        take: 5
      })

      const trendingIdeasData = trendingIdeas.map(idea => ({
        ideaId: idea.id,
        title: idea.title,
        voteGrowth: idea.votes.length
      }))

      return {
        activeUsers,
        recentActivity,
        trendingIdeas: trendingIdeasData
      }
    } catch (error) {
      console.error('Error getting real-time insights:', error)
      return {
        activeUsers: 0,
        recentActivity: [],
        trendingIdeas: []
      }
    }
  }

  private static calculateSessions(events: any[]): Array<{ start: Date; end: Date; duration: number }> {
    // Simplified session calculation - group events within 30 minutes
    const sessions: Array<{ start: Date; end: Date; duration: number }> = []
    let currentSession: { start: Date; end: Date } | null = null

    for (const event of events) {
      const eventTime = new Date(event.timestamp)
      
      if (!currentSession) {
        currentSession = { start: eventTime, end: eventTime }
      } else {
        const timeDiff = eventTime.getTime() - currentSession.end.getTime()
        if (timeDiff <= 30 * 60 * 1000) { // 30 minutes
          currentSession.end = eventTime
        } else {
          sessions.push({
            ...currentSession,
            duration: currentSession.end.getTime() - currentSession.start.getTime()
          })
          currentSession = { start: eventTime, end: eventTime }
        }
      }
    }

    if (currentSession) {
      sessions.push({
        ...currentSession,
        duration: currentSession.end.getTime() - currentSession.start.getTime()
      })
    }

    return sessions
  }

  private static calculateMonthlyActivity(ideas: any[]): Array<{ month: string; ideas: number; votes: number }> {
    const monthlyData: Record<string, { ideas: number; votes: number }> = {}

    ideas.forEach(idea => {
      const month = new Date(idea.createdAt).toISOString().slice(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { ideas: 0, votes: 0 }
      }
      monthlyData[month].ideas++
      monthlyData[month].votes += idea.votes.length
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }

  private static calculateEngagementTrend(months: Array<{ ideas: number; votes: number }>): 'increasing' | 'decreasing' | 'stable' {
    if (months.length < 2) return 'stable'

    const totalEngagement = months.map(m => m.ideas + m.votes)
    const firstHalf = totalEngagement.slice(0, Math.ceil(months.length / 2))
    const secondHalf = totalEngagement.slice(Math.floor(months.length / 2))

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length

    const change = (secondAvg - firstAvg) / firstAvg

    if (change > 0.1) return 'increasing'
    if (change < -0.1) return 'decreasing'
    return 'stable'
  }

  private static getEventDescription(event: any): string {
    switch (event.type) {
      case 'page_view':
        return 'Viewed a page'
      case 'idea_created':
        return 'Created a new idea'
      case 'vote_cast':
        return 'Cast a vote'
      case 'comment_added':
        return 'Added a comment'
      case 'search_performed':
        return 'Performed a search'
      case 'filter_applied':
        return 'Applied a filter'
      default:
        return 'Performed an action'
    }
  }
}
