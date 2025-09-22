'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, Pause, ChevronLeft, ChevronRight, Maximize2, Heart, Share2, Download } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface LuxuryIdeaLayoutProps {
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
      avatar: string | null
    }
    group: {
      slug: string
      name: string
    }
  }
  onPromoteToTrip: () => void
  isPromoting: boolean
  onVote: (type: 'up' | 'maybe' | 'down') => void
  onComment: (body: string) => void
  isVoting: boolean
  isCommenting: boolean
  localVotes: any
  localComments: any
}

export function LuxuryIdeaLayout({ 
  idea, 
  onPromoteToTrip, 
  isPromoting, 
  onVote, 
  onComment, 
  isVoting, 
  isCommenting, 
  localVotes, 
  localComments 
}: LuxuryIdeaLayoutProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Auto-advance images like a screensaver
  useEffect(() => {
    if (!isPlaying || idea.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % idea.images.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isPlaying, idea.images.length])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % idea.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + idea.images.length) % idea.images.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getBudgetIcon = (level: string | null) => {
    switch (level) {
      case 'LOW': return '💰'
      case 'MEDIUM': return '💳'
      case 'HIGH': return '💎'
      default: return '💵'
    }
  }

  const getMonthName = (month: number | null) => {
    if (!month) return null
    return new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="relative w-full h-full">
          {/* Fullscreen Image */}
          {idea.images.length > 0 && (
            <img
              src={idea.images[currentImageIndex].url}
              alt={idea.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Fullscreen Controls */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="flex space-x-4">
              <Button
                onClick={prevImage}
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button
                onClick={nextImage}
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Exit Fullscreen */}
          <Button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Full-screen Image Background */}
      {idea.images.length > 0 && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80 z-10"></div>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={idea.images[currentImageIndex].url}
              alt={idea.title}
              className="w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Link
              href={`/g/${idea.group.slug}`}
              className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to {idea.group.name}
            </Link>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-6xl font-light text-white mb-4 tracking-tight">
                  {idea.title}
                </h1>
                <p className="text-xl text-white/80 max-w-4xl leading-relaxed font-light mb-4">
                  {idea.prompt}
                </p>
                <div className="flex items-center space-x-4 text-white/60">
                  <span>{formatDate(idea.createdAt)}</span>
                  <span>•</span>
                  <span>by {idea.author.name}</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Maximize2 className="h-5 w-5 mr-2" />
                  Fullscreen
                </Button>
                
                <Button
                  onClick={onPromoteToTrip}
                  disabled={isPromoting}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-semibold shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 px-8 py-4 text-lg rounded-xl border border-amber-400/20"
                >
                  {isPromoting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                      Promoting...
                    </>
                  ) : (
                    'Promote to Trip'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Controls */}
        {idea.images.length > 1 && (
          <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-30">
            <div className="flex flex-col space-y-3">
              <Button
                onClick={prevImage}
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full w-12 h-12"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full w-12 h-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button
                onClick={nextImage}
                variant="ghost"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full w-12 h-12"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Image Indicators */}
        {idea.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
            <div className="flex space-x-2">
              {idea.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Content Panel */}
        <div className="mt-auto bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Summary */}
                {idea.summary && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-3">Summary</h3>
                    <p className="text-white/80 leading-relaxed">{idea.summary}</p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {idea.budgetLevel && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getBudgetIcon(idea.budgetLevel)}</span>
                        <h4 className="text-lg font-semibold text-white">Budget</h4>
                      </div>
                      <p className="text-white/80 capitalize">{idea.budgetLevel.toLowerCase()}</p>
                    </div>
                  )}

                  {idea.monthHint && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">📅</span>
                        <h4 className="text-lg font-semibold text-white">Month</h4>
                      </div>
                      <p className="text-white/80">{getMonthName(idea.monthHint)}</p>
                    </div>
                  )}

                  {idea.kidsFriendly && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">👶</span>
                        <h4 className="text-lg font-semibold text-white">Kids Friendly</h4>
                      </div>
                      <p className="text-white/80">Yes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="space-y-6">
                {/* Voting */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Vote</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => onVote('up')}
                      disabled={isVoting}
                      className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Love it ({localVotes.up})
                    </Button>
                    <Button
                      onClick={() => onVote('maybe')}
                      disabled={isVoting}
                      className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300"
                    >
                      Maybe ({localVotes.maybe})
                    </Button>
                    <Button
                      onClick={() => onVote('down')}
                      disabled={isVoting}
                      className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                    >
                      Not for me ({localVotes.down})
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
