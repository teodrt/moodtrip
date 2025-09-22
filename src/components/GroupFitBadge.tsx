'use client'

import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface GroupFitBadgeProps {
  score: number
}

export function GroupFitBadge({ score }: GroupFitBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 text-xs ${getScoreColor(score)}`}
    >
      <Users className="h-3 w-3" />
      <span>Group fit: {score}%</span>
      <span className="opacity-75">({getScoreLabel(score)})</span>
    </Badge>
  )
}
