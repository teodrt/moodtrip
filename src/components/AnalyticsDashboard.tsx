'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Heart, MessageSquare, Calendar, DollarSign } from 'lucide-react'

interface AnalyticsData {
  totalIdeas: number
  totalVotes: number
  totalComments: number
  popularTags: Array<{ tag: string; count: number }>
  monthlyActivity: Array<{ month: string; ideas: number; votes: number }>
  budgetDistribution: Array<{ budget: string; count: number; percentage: number }>
  topIdeas: Array<{ id: string; title: string; votes: number; comments: number }>
}

interface AnalyticsDashboardProps {
  groupId: string
}

export function AnalyticsDashboard({ groupId }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      setLoading(true)
      // Mock data - in real app, fetch from API
      setTimeout(() => {
        setData({
          totalIdeas: 24,
          totalVotes: 156,
          totalComments: 89,
          popularTags: [
            { tag: 'beach', count: 12 },
            { tag: 'adventure', count: 8 },
            { tag: 'culture', count: 6 },
            { tag: 'food', count: 5 },
            { tag: 'nature', count: 4 }
          ],
          monthlyActivity: [
            { month: 'Jan', ideas: 3, votes: 12 },
            { month: 'Feb', ideas: 5, votes: 18 },
            { month: 'Mar', ideas: 7, votes: 25 },
            { month: 'Apr', ideas: 4, votes: 15 },
            { month: 'May', ideas: 6, votes: 22 },
            { month: 'Jun', ideas: 8, votes: 28 }
          ],
          budgetDistribution: [
            { budget: 'LOW', count: 8, percentage: 33 },
            { budget: 'MEDIUM', count: 10, percentage: 42 },
            { budget: 'HIGH', count: 6, percentage: 25 }
          ],
          topIdeas: [
            { id: '1', title: 'Beach Getaway in Maldives', votes: 15, comments: 8 },
            { id: '2', title: 'Mountain Hiking Adventure', votes: 12, comments: 5 },
            { id: '3', title: 'Cultural City Tour', votes: 10, comments: 6 }
          ]
        })
        setLoading(false)
      }, 1000)
    }

    fetchAnalytics()
  }, [groupId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalIdeas}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
            <CardDescription>Most used tags in your group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.popularTags.map((item, index) => (
                <div key={item.tag} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{item.tag}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / data.popularTags[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Distribution</CardTitle>
            <CardDescription>Ideas by budget level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.budgetDistribution.map((item) => (
                <div key={item.budget} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{item.budget.toLowerCase()}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.budget === 'LOW' ? 'bg-green-500' :
                        item.budget === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Ideas */}
      <Card>
        <CardHeader>
          <CardTitle>Top Ideas</CardTitle>
          <CardDescription>Most popular ideas by engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topIdeas.map((idea, index) => (
              <div key={idea.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{idea.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{idea.votes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{idea.comments}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">
                  {idea.votes + idea.comments} pts
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
