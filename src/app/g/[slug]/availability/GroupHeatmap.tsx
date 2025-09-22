'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp } from "lucide-react"

interface GroupHeatmapProps {
  groupAvailability: Array<{
    month: number
    averageScore: number
    participantCount: number
  }>
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export function GroupHeatmap({ groupAvailability }: GroupHeatmapProps) {
  const getHeatmapColor = (score: number) => {
    if (score === 0) return 'bg-gray-100 text-gray-600'
    if (score <= 25) return 'bg-red-100 text-red-800'
    if (score <= 50) return 'bg-orange-100 text-orange-800'
    if (score <= 75) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getIntensity = (score: number) => {
    if (score === 0) return 0.1
    if (score <= 25) return 0.3
    if (score <= 50) return 0.5
    if (score <= 75) return 0.7
    return 0.9
  }

  const getScoreLabel = (score: number) => {
    if (score === 0) return 'Unavailable'
    if (score <= 25) return 'Very Low'
    if (score <= 50) return 'Low'
    if (score <= 75) return 'Medium'
    return 'High'
  }

  const bestMonths = groupAvailability
    .filter(month => month.averageScore > 0)
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Availability Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Heatmap Grid */}
        <div className="grid grid-cols-4 gap-3">
          {monthNames.map((month, index) => {
            const monthData = groupAvailability.find(m => m.month === index + 1)
            const score = monthData?.averageScore || 0
            const participants = monthData?.participantCount || 0
            
            return (
              <motion.div
                key={month}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="text-center"
              >
                <div
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    getHeatmapColor(score)
                  }`}
                  style={{
                    opacity: getIntensity(score),
                    borderColor: score > 0 ? 'currentColor' : '#e5e7eb'
                  }}
                >
                  <div className="text-sm font-semibold mb-1">{month}</div>
                  <div className="text-lg font-bold">{Math.round(score)}%</div>
                  <div className="text-xs opacity-75">
                    {participants} {participants === 1 ? 'person' : 'people'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Best Months */}
        {bestMonths.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <TrendingUp className="h-4 w-4" />
              Best Months for Group Travel
            </div>
            <div className="flex flex-wrap gap-2">
              {bestMonths.map((month, index) => (
                <Badge
                  key={month.month}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="text-lg">
                    {monthNames[month.month - 1]}
                  </span>
                  <span className="text-xs opacity-75">
                    {Math.round(month.averageScore)}%
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600">
            <p className="mb-3 font-medium">Availability Levels:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-100 border"></div>
                <span>0% - Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                <span>1-25% - Very Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                <span>26-50% - Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
                <span>51-75% - Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                <span>76-100% - High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
