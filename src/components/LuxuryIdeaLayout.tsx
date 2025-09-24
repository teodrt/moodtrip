'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, Heart, Share2, Download, Plane, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ColorPalette } from '@/components/ColorPalette'

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
      id: string
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
  onDelete?: () => void
  isVoting: boolean
  isCommenting: boolean
  isDeleting?: boolean
  localVotes: any
  localComments: any
  currentUserId?: string
}

export function LuxuryIdeaLayout({ 
  idea, 
  onPromoteToTrip, 
  isPromoting, 
  onVote, 
  onComment, 
  onDelete,
  isVoting, 
  isCommenting, 
  isDeleting,
  localVotes, 
  localComments,
  currentUserId
}: LuxuryIdeaLayoutProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % idea.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + idea.images.length) % idea.images.length)
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error)
    }
    setIsFullscreen(false)
  }

  const enterFullscreen = () => {
    const element = document.documentElement
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(console.error)
      setIsFullscreen(true)
    }
  }

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prevImage()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      nextImage()
    } else if (event.key === ' ') {
      event.preventDefault()
      setIsPlaying(!isPlaying)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      exitFullscreen()
    }
  }, [isPlaying, idea.images.length, exitFullscreen])

  // Auto-advance images like a screensaver
  useEffect(() => {
    if (!isPlaying || idea.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % idea.images.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isPlaying, idea.images.length])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Touch gesture handlers
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndY, setTouchEndY] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
    setTouchEndY(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distanceX = touchStart - touchEnd
    const distanceY = touchStartY && touchEndY ? touchStartY - touchEndY : 0
    
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50
    const isSwipeDown = distanceY < -100

    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    } else if (isSwipeDown && isFullscreen) {
      exitFullscreen()
    }
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
      {/* Clean Layered Structure */}
      
      {/* Layer 1: Background Image */}
      {idea.images.length > 0 ? (
        <div 
          className="fixed inset-0 z-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.img
            key={currentImageIndex}
            src={idea.images[currentImageIndex].url}
            alt={idea.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-6xl mb-4 opacity-50">🖼️</div>
              <p className="text-xl font-light">No images available</p>
            </div>
          </div>
        </div>
      )}

      {/* Layer 2: Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header - Clean and Minimal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 z-20"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link
                href={`/g/${idea.group.slug}`}
                className="inline-flex items-center text-sm text-white/90 hover:text-white transition-all duration-300 group"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to {idea.group.name}</span>
              </Link>
              
              <div className="flex space-x-3">
                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-xl"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
                
                <Button
                  onClick={onPromoteToTrip}
                  disabled={isPromoting}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold px-6 py-2 rounded-xl"
                >
                  {isPromoting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                      Promoting...
                    </>
                  ) : (
                    <>
                      <Plane className="h-4 w-4 mr-2" />
                      Promote to Trip
                    </>
                  )}
                </Button>

                {currentUserId && idea.author && currentUserId === idea.author.id && onDelete && (
                  <Button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Image Navigation - Clean and Minimal */}
        {idea.images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-30">
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-2 border border-white/10">
              <Button
                onClick={prevImage}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full w-8 h-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full w-8 h-8"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={nextImage}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full w-8 h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full w-8 h-8"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Image Indicators - Bottom Left */}
        {idea.images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-30">
            <div className="flex space-x-1 bg-black/20 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
              {idea.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content - Clean and Focused */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              className="text-center lg:text-left"
            >
              {/* Title with clean background */}
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mb-4">
                <h1 className="text-4xl lg:text-6xl font-display text-white mb-4 leading-tight">
                  {idea.title}
                </h1>
                <p className="text-lg lg:text-xl text-white/90 max-w-4xl">
                  {idea.prompt}
                </p>
              </div>
              
              {/* Metadata - Simple and Clean */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-white/80">
                <span className="text-sm">
                  {formatDate(idea.createdAt)}
                </span>
                <span className="text-sm">
                  by {idea.author.name}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Voting Section - Clean and Simple */}
        <div className="absolute bottom-4 left-4 z-30">
          <div className="flex gap-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-2 border border-white/10">
            <button
              onClick={() => onVote('up')}
              disabled={isVoting}
              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full text-sm font-medium transition-all duration-300"
            >
              <Heart className="h-4 w-4 inline mr-1" />
              {localVotes.up}
            </button>
            <button
              onClick={() => onVote('maybe')}
              disabled={isVoting}
              className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-full text-sm font-medium transition-all duration-300"
            >
              ? {localVotes.maybe}
            </button>
            <button
              onClick={() => onVote('down')}
              disabled={isVoting}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full text-sm font-medium transition-all duration-300"
            >
              ✕ {localVotes.down}
            </button>
          </div>
        </div>

        {/* Color Palette - Simple and Clean */}
        {idea.palette && idea.palette.length > 0 && (
          <div className="absolute bottom-4 right-4 z-30">
            <div className="bg-black/20 backdrop-blur-md rounded-full px-3 py-2 border border-white/10">
              <div className="flex gap-2">
                {idea.palette.slice(0, 5).map((color, index) => (
                  <div
                    key={color}
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
