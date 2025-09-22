'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Lightbulb, 
  Heart, 
  MessageCircle, 
  Calendar, 
  DollarSign,
  MapPin,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  Star,
  Eye,
  Share2,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalIdeas: number
    totalVotes: number
    totalComments: number
    activeUsers: number
    engagementRate: number
    conversionRate: number
  }
  trends: {
    ideasPerWeek: Array<{ week: string; count: number }>
    votesPerWeek: Array<{ week: string; count: number }>
    commentsPerWeek: Array<{ week: string; count: number }>
  }
  topIdeas: Array<{
    id: string
    title: string
    votes: number
    comments: number
    views: number
    engagement: number
  }>
  userActivity: Array<{
    userId: string
    userName: string
    ideasCreated: number
    votesCast: number
    commentsMade: number
    engagementScore: number
  }>
  destinations: Array<{
    destination: string
    count: number
    avgRating: number
    totalVotes: number
  }>
  budgetAnalysis: {
    low: number
    medium: number
    high: number
    avgBudget: number
  }
  timeAnalysis: {
    peakHours: Array<{ hour: number; activity: number }>
    peakDays: Array<{ day: string; activity: number }>
  }
  insights: Array<{
    type: 'positive' | 'negative' | 'neutral'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
  }>
}

interface AdvancedAnalyticsProps {
  groupId: string
  timeRange?: '7d' | '30d' | '90d' | '1y'
  className?: string
}

export function AdvancedAnalytics({ 
  groupId, 
  timeRange = '30d',
  className 
}: AdvancedAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<string>('overview')

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData({
        overview: {
          totalIdeas: 47,
          totalVotes: 234,
          totalComments: 89,
          activeUsers: 12,
          engagementRate: 0.73,
          conversionRate: 0.45
        },
        trends: {
          ideasPerWeek: [
            { week: 'Week 1', count: 8 },
            { week: 'Week 2', count: 12 },
            { week: 'Week 3', count: 15 },
            { week: 'Week 4', count: 12 }
          ],
          votesPerWeek: [
            { week: 'Week 1', count: 45 },
            { week: 'Week 2', count: 67 },
            { week: 'Week 3', count: 89 },
            { week: 'Week 4', count: 33 }
          ],
          commentsPerWeek: [
            { week: 'Week 1', count: 18 },
            { week: 'Week 2', count: 25 },
            { week: 'Week 3', count: 32 },
            { week: 'Week 4', count: 14 }
          ]
        },
        topIdeas: [
          { id: '1', title: 'Beach Getaway in Maldives', votes: 23, comments: 8, views: 156, engagement: 0.89 },
          { id: '2', title: 'Cultural Tour of Japan', votes: 19, comments: 12, views: 134, engagement: 0.82 },
          { id: '3', title: 'Adventure in New Zealand', votes: 17, comments: 6, views: 98, engagement: 0.76 },
          { id: '4', title: 'Relaxing in Bali', votes: 15, comments: 9, views: 112, engagement: 0.71 },
          { id: '5', title: 'City Break in Barcelona', votes: 13, comments: 5, views: 87, engagement: 0.68 }
        ],
        userActivity: [
          { userId: '1', userName: 'Alice Johnson', ideasCreated: 8, votesCast: 45, commentsMade: 23, engagementScore: 0.92 },
          { userId: '2', userName: 'Bob Smith', ideasCreated: 6, votesCast: 38, commentsMade: 18, engagementScore: 0.87 },
          { userId: '3', userName: 'Carol Davis', ideasCreated: 5, votesCast: 42, commentsMade: 15, engagementScore: 0.84 },
          { userId: '4', userName: 'David Wilson', ideasCreated: 4, votesCast: 35, commentsMade: 12, engagementScore: 0.79 },
          { userId: '5', userName: 'Eva Brown', ideasCreated: 3, votesCast: 28, commentsMade: 9, engagementScore: 0.73 }
        ],
        destinations: [
          { destination: 'Maldives', count: 8, avgRating: 4.8, totalVotes: 45 },
          { destination: 'Japan', count: 6, avgRating: 4.6, totalVotes: 38 },
          { destination: 'New Zealand', count: 5, avgRating: 4.4, totalVotes: 32 },
          { destination: 'Bali', count: 4, avgRating: 4.2, totalVotes: 28 },
          { destination: 'Barcelona', count: 3, avgRating: 4.0, totalVotes: 25 }
        ],
        budgetAnalysis: {
          low: 12,
          medium: 23,
          high: 12,
          avgBudget: 2500
        },
        timeAnalysis: {
          peakHours: [
            { hour: 9, activity: 15 },
            { hour: 12, activity: 28 },
            { hour: 15, activity: 22 },
            { hour: 18, activity: 35 },
            { hour: 21, activity: 18 }
          ],
          peakDays: [
            { day: 'Monday', activity: 45 },
            { day: 'Tuesday', activity: 52 },
            { day: 'Wednesday', activity: 48 },
            { day: 'Thursday', activity: 55 },
            { day: 'Friday', activity: 62 },
            { day: 'Saturday', activity: 38 },
            { day: 'Sunday', activity: 29 }
          ]
        },
        insights: [
          {
            type: 'positive',
            title: 'High Engagement Rate',
            description: 'Your group has a 73% engagement rate, which is 15% above average.',
            impact: 'high'
          },
          {
            type: 'positive',
            title: 'Growing User Base',
            description: 'Active users increased by 25% this month.',
            impact: 'medium'
          },
          {
            type: 'neutral',
            title: 'Peak Activity Time',
            description: 'Most activity occurs on Fridays at 6 PM.',
            impact: 'low'
          },
          {
            type: 'negative',
            title: 'Low Weekend Activity',
            description: 'Weekend engagement is 40% lower than weekdays.',
            impact: 'medium'
          }
        ]
      })
      setLoading(false)
    }

    loadAnalytics()
  }, [groupId, timeRange])

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Insights and metrics for your group</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ideas</p>
                <p className="text-2xl font-bold">{data.overview.totalIdeas}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold">{data.overview.totalVotes}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-2xl font-bold">{data.overview.totalComments}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{Math.round(data.overview.engagementRate * 100)}%</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={data.overview.engagementRate * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Activity Trends
            </CardTitle>
            <CardDescription>Ideas, votes, and comments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.trends.ideasPerWeek.map((week, index) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{week.week}</span>
                    <span>{week.count} ideas</span>
                  </div>
                  <Progress value={(week.count / 15) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Ideas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Top Ideas
            </CardTitle>
            <CardDescription>Most popular ideas by engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topIdeas.map((idea, index) => (
                <div key={idea.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{idea.title}</h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {idea.votes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {idea.comments}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {idea.views}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(idea.engagement * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destinations and Budget Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Destinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Popular Destinations
            </CardTitle>
            <CardDescription>Most discussed travel destinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.destinations.map((dest, index) => (
                <div key={dest.destination} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{dest.destination}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{dest.avgRating.toFixed(1)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {dest.count} ideas
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(dest.count / 8) * 100} className="h-2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Budget Analysis
            </CardTitle>
            <CardDescription>Distribution of budget preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold">${data.budgetAnalysis.avgBudget.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Average Budget</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Budget</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(data.budgetAnalysis.low / 47) * 100} className="h-2 w-20" />
                    <span className="text-sm font-medium">{data.budgetAnalysis.low}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium Budget</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(data.budgetAnalysis.medium / 47) * 100} className="h-2 w-20" />
                    <span className="text-sm font-medium">{data.budgetAnalysis.medium}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Budget</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(data.budgetAnalysis.high / 47) * 100} className="h-2 w-20" />
                    <span className="text-sm font-medium">{data.budgetAnalysis.high}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            AI Insights
          </CardTitle>
          <CardDescription>Automated insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'positive' ? 'border-green-500 bg-green-50' :
                  insight.type === 'negative' ? 'border-red-500 bg-red-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                  <Badge 
                    variant={insight.impact === 'high' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {insight.impact}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
