'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, HelpCircle, ThumbsDown, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GroupFitBadge } from '@/components/GroupFitBadge'

interface IdeaCardProps {
  idea: {
    id: string
    title: string
    tags: string[]
    coverImage: string
    votes: {
      up: number
      maybe: number
      down: number
    }
    comments: number
    author: {
      name: string
      avatar: string | null
    }
    groupFit?: number
  }
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link href={`/i/${idea.id}`} className="block h-full">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-gray-200 h-full flex flex-col min-h-[400px]">
          {/* Cover Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={idea.coverImage}
              alt={idea.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Top Content */}
            <div className="space-y-3 flex-1">
              {/* Title */}
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {idea.title}
              </h3>

              {/* Tags and Group Fit */}
              <div className="flex flex-wrap gap-1.5">
                {idea.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                  >
                    {tag}
                  </Badge>
                ))}
                {idea.groupFit && (
                  <GroupFitBadge score={idea.groupFit} />
                )}
              </div>
            </div>

            {/* Stats and Author - Always at bottom */}
            <div className="flex items-center justify-between pt-4 mt-auto">
              {/* Vote Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3 text-green-500" />
                  <span className="font-medium">{idea.votes.up}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-yellow-500" />
                  <span className="font-medium">{idea.votes.maybe}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-3 w-3 text-red-500" />
                  <span className="font-medium">{idea.votes.down}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span className="font-medium">{idea.comments}</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={idea.author.avatar || undefined} />
                  <AvatarFallback className="text-xs">
                    {idea.author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600 font-medium">
                  {idea.author.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
