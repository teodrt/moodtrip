'use client'

import { memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, DollarSign, Baby, Plane, Heart, MessageCircle, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react'
import { AdvancedImage } from './AdvancedImage'
import { ColorPalette } from './ColorPalette'

// Memoized Idea Card Component
interface IdeaCardProps {
  idea: {
    id: string
    title: string
    prompt: string
    status: string
    tags: string[]
    palette: string[]
    summary: string | null
    budgetLevel: string | null
    monthHint: number | null
    kidsFriendly: boolean
    createdAt: Date
    images: Array<{
      id: string
      url: string
      source: string
      provider: string | null
    }>
    votes: {
      up: number
      maybe: number
      down: number
    }
    comments: Array<{
      id: string
      body: string
      createdAt: Date
      author: {
        name: string
        avatar: string | null
      }
    }>
    author: {
      name: string
      avatarUrl: string | null
    }
  }
  onVote: (ideaId: string, voteType: 'UP' | 'MAYBE' | 'DOWN') => void
  onPromote: (ideaId: string) => void
  isVoting: boolean
  isPromoting: boolean
}

export const MemoizedIdeaCard = memo(function IdeaCard({
  idea,
  onVote,
  onPromote,
  isVoting,
  isPromoting,
}: IdeaCardProps) {
  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }, [])

  const getBudgetIcon = useCallback((level: string | null) => {
    switch (level) {
      case 'LOW': return '💰'
      case 'MEDIUM': return '💳'
      case 'HIGH': return '💎'
      default: return '💵'
    }
  }, [])

  const getMonthName = useCallback((month: number | null) => {
    if (!month) return null
    return new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })
  }, [])

  const mainImage = useMemo(() => {
    return idea.images.length > 0 ? idea.images[0] : {
      id: 'mock',
      url: 'https://picsum.photos/800/600?random=' + idea.id,
      source: 'STOCK',
      provider: 'Mock'
    }
  }, [idea.images, idea.id])

  const handleVote = useCallback((voteType: 'UP' | 'MAYBE' | 'DOWN') => {
    onVote(idea.id, voteType)
  }, [idea.id, onVote])

  const handlePromote = useCallback(() => {
    onPromote(idea.id)
  }, [idea.id, onPromote])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden">
          <AdvancedImage
            src={mainImage.url}
            alt={idea.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge 
              variant={idea.status === 'PUBLISHED' ? 'default' : 'secondary'}
              className="backdrop-blur-sm bg-white/90 text-gray-900"
            >
              {idea.status}
            </Badge>
          </div>

          {/* Author Avatar */}
          <div className="absolute top-4 right-4">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src={idea.author.avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {idea.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content Section */}
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title and Prompt */}
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {idea.title}
              </CardTitle>
              <CardDescription className="text-gray-600 line-clamp-3">
                {idea.prompt}
              </CardDescription>
            </div>

            {/* Tags and Metadata */}
            <div className="flex flex-wrap gap-2">
              {idea.budgetLevel && (
                <Badge variant="outline" className="text-xs">
                  {getBudgetIcon(idea.budgetLevel)} {idea.budgetLevel}
                </Badge>
              )}
              {idea.monthHint && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {getMonthName(idea.monthHint)}
                </Badge>
              )}
              {idea.kidsFriendly && (
                <Badge variant="outline" className="text-xs">
                  <Baby className="h-3 w-3 mr-1" />
                  Kids-friendly
                </Badge>
              )}
            </div>

            {/* Color Palette */}
            {idea.palette && idea.palette.length > 0 && (
              <ColorPalette colors={idea.palette} size="sm" />
            )}

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {idea.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {idea.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{idea.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Voting Section */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('UP')}
                  disabled={isVoting}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{idea.votes.up}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('MAYBE')}
                  disabled={isVoting}
                  className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>{idea.votes.maybe}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('DOWN')}
                  disabled={isVoting}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span>{idea.votes.down}</span>
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {idea.comments.length}
                </span>
                <Button
                  onClick={handlePromote}
                  disabled={isPromoting}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isPromoting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                      Promoting...
                    </>
                  ) : (
                    <>
                      <Plane className="h-4 w-4 mr-1" />
                      Promote
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              Created by {idea.author.name} • {formatDate(idea.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
})

// Memoized Image Grid Component
interface ImageGridProps {
  images: Array<{
    id: string
    url: string
    source: string
    provider: string | null
  }>
  onImageClick?: (image: any) => void
  maxImages?: number
}

export const MemoizedImageGrid = memo(function ImageGrid({
  images,
  onImageClick,
  maxImages = 4
}: ImageGridProps) {
  const displayImages = useMemo(() => {
    return images.slice(0, maxImages)
  }, [images, maxImages])

  const handleImageClick = useCallback((image: any) => {
    onImageClick?.(image)
  }, [onImageClick])

  return (
    <div className="grid grid-cols-2 gap-2">
      {displayImages.map((image, index) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => handleImageClick(image)}
        >
          <AdvancedImage
            src={image.url}
            alt={`Image ${index + 1}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </motion.div>
      ))}
    </div>
  )
})

// Memoized Loading Skeleton
interface LoadingSkeletonProps {
  count?: number
  className?: string
}

export const MemoizedLoadingSkeleton = memo(function LoadingSkeleton({
  count = 6,
  className
}: LoadingSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden">
            <div className="h-64 bg-gray-200 animate-pulse" />
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
                <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-12" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-12" />
                </div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
})
