'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check } from "lucide-react"
import { updateAvailability } from "@/app/actions"

interface AvailabilityFormProps {
  groupId: string
  initialAvailability: Array<{
    month: number
    score: number
  }>
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function AvailabilityForm({ groupId, initialAvailability }: AvailabilityFormProps) {
  const [availability, setAvailability] = useState<number[]>(() => {
    const scores = new Array(12).fill(0)
    initialAvailability.forEach(item => {
      scores[item.month - 1] = item.score
    })
    return scores
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleMonthChange = async (monthIndex: number, value: number[]) => {
    const newAvailability = [...availability]
    newAvailability[monthIndex] = value[0]
    setAvailability(newAvailability)

    // Debounced save
    setIsSaving(true)
    try {
      await updateAvailability(groupId, monthIndex + 1, value[0])
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error saving availability:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-gray-400'
    if (score <= 25) return 'text-red-500'
    if (score <= 50) return 'text-orange-500'
    if (score <= 75) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getScoreLabel = (score: number) => {
    if (score === 0) return 'Unavailable'
    if (score <= 25) return 'Very Low'
    if (score <= 50) return 'Low'
    if (score <= 75) return 'Medium'
    return 'High'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Monthly Availability
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>Saving...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {monthNames.map((month, index) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <Label htmlFor={`month-${index}`} className="text-base font-medium">
                {month}
              </Label>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={getScoreColor(availability[index])}
                >
                  {availability[index]}%
                </Badge>
                <span className={`text-sm ${getScoreColor(availability[index])}`}>
                  {getScoreLabel(availability[index])}
                </span>
              </div>
            </div>
            
            <Slider
              id={`month-${index}`}
              value={[availability[index]]}
              onValueChange={(value) => handleMonthChange(index, value)}
              max={100}
              step={5}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>0% - Unavailable</span>
              <span>100% - Fully Available</span>
            </div>
          </motion.div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>How to use:</strong></p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>0%</strong> - Completely unavailable (work, other commitments)</li>
              <li>• <strong>25%</strong> - Very limited availability</li>
              <li>• <strong>50%</strong> - Some flexibility, prefer shorter trips</li>
              <li>• <strong>75%</strong> - Good availability, can do longer trips</li>
              <li>• <strong>100%</strong> - Fully available, any duration</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
