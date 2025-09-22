'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Plus, 
  Sparkles, 
  Image, 
  Calendar, 
  Users, 
  Plane,
  Lightbulb,
  ClipboardList,
  Clock,
  Heart
} from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description: string
  icon: React.ElementType
  action?: {
    label: string
    href: string
  }
  illustration?: React.ReactNode
}

export function EmptyState({ title, description, icon: Icon, action, illustration }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center"
        >
          <Icon className="h-10 w-10 text-blue-500" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Action Button */}
        {action && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href={action.href}>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg">
                <Plus className="h-5 w-5 mr-2" />
                {action.label}
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Illustration */}
        {illustration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            {illustration}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Specific empty state components
export function EmptyIdeasFeed({ groupSlug }: { groupSlug: string }) {
  return (
    <EmptyState
      title="No ideas yet!"
      description="Be the first to share a brilliant travel idea for this group. We'll help you bring it to life with AI-generated moodboards."
      icon={Lightbulb}
      action={{
        label: "Create Your First Idea",
        href: `/g/${groupSlug}/new`
      }}
      illustration={
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center"
            >
              <Sparkles className="h-6 w-6 text-blue-400" />
            </motion.div>
          ))}
        </div>
      }
    />
  )
}

export function EmptyIdeaImages() {
  return (
    <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
      <CardContent className="p-12">
        <EmptyState
          title="Images coming soon!"
          description="We're generating beautiful moodboard images for this idea. This usually takes just a few moments."
          icon={Image}
          illustration={
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl"
                />
              ))}
            </div>
          }
        />
      </CardContent>
    </Card>
  )
}

export function EmptyTripTasks({ tripId }: { tripId: string }) {
  return (
    <EmptyState
      title="Ready to start planning?"
      description="This trip doesn't have any tasks yet. Add your first task to begin organizing your travel plans."
      icon={ClipboardList}
      action={{
        label: "Add First Task",
        href: `#` // Will be handled by the add task dialog
      }}
      illustration={
        <div className="flex space-x-3">
          {['TODO', 'DOING', 'DONE'].map((status, i) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
              className="w-20 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-xs font-medium text-gray-500">{status}</span>
            </motion.div>
          ))}
        </div>
      }
    />
  )
}

export function EmptyComments() {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center"
      >
        <Heart className="h-8 w-8 text-blue-400" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
      <p className="text-gray-600">Be the first to share your thoughts on this idea!</p>
    </div>
  )
}

export function EmptyAvailability() {
  return (
    <EmptyState
      title="Set your availability"
      description="Help your group find the best time to travel by setting your availability for each month."
      icon={Calendar}
      action={{
        label: "Set Availability",
        href: "#" // Will be handled by the availability form
      }}
      illustration={
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
              className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center"
            >
              <span className="text-xs font-medium text-blue-600">{i + 1}</span>
            </motion.div>
          ))}
        </div>
      }
    />
  )
}
