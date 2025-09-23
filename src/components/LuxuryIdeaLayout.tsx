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
      {/* Hero Image - Maximum Visual Impact */}
      {idea.images.length > 0 ? (
        <div 
          className="fixed inset-0 z-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ultra-minimal overlay for maximum image visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
          
          {/* Hero image with cinematic treatment and subtle parallax */}
            <motion.img
              key={currentImageIndex}
              src={idea.images[currentImageIndex].url}
              alt={idea.title}
              className="w-full h-full object-cover object-center"
            style={{
              transform: 'scale(1.02)',
              filter: 'brightness(0.85) contrast(1.15) saturate(1.1)',
            }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.02 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth transition
            }}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.8, ease: "easeOut" }
            }}
            onError={(e) => {
              console.error('Error loading image:', idea.images[currentImageIndex].url, e)
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', idea.images[currentImageIndex].url)
            }}
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Premium Travel-Inspired Background for No Images */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gentle floating orbs */}
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, 20, -10, 0],
                y: [0, -10, 5, 0],
                scale: [1, 1.02, 0.98, 1],
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, -15, 8, 0],
                y: [0, 15, -8, 0],
                scale: [1, 0.98, 1.02, 1],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4
              }}
            />
            <motion.div 
              className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              animate={{
                x: [0, 12, -18, 0],
                y: [0, -8, 15, 0],
                scale: [1, 1.01, 0.99, 1],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 6
              }}
            />
            
            {/* Subtle floating particles */}
            <motion.div 
              className="absolute top-20 left-20 w-2 h-2 bg-white/10 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute top-40 right-32 w-3 h-3 bg-purple-400/20 rounded-full"
              animate={{
                y: [0, -12, 0],
                x: [0, 5, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute bottom-32 left-32 w-1 h-1 bg-pink-400/25 rounded-full"
              animate={{
                y: [0, -15, 0],
                x: [0, -8, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            <motion.div 
              className="absolute bottom-20 right-20 w-2 h-2 bg-yellow-400/15 rounded-full"
              animate={{
                y: [0, -18, 0],
                x: [0, 10, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5
              }}
            />
            
            {/* Gentle wave patterns */}
            <motion.div 
              className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div 
              className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent"
              animate={{
                x: ['100%', '-100%'],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear",
                delay: 8
              }}
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80 z-10"></div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white/60">
              <div className="text-8xl mb-6 opacity-50">🖼️</div>
              <p className="text-2xl font-light">No images available</p>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Header - Maximum Image Focus */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Ultra-minimal floating header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 left-0 right-0 z-30"
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Back Navigation - Minimal */}
            <Link
              href={`/g/${idea.group.slug}`}
                className="inline-flex items-center text-sm text-white/90 hover:text-white transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ x: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </motion.div>
                <span className="font-medium">Back to {idea.group.name}</span>
            </Link>
              
              {/* Action Buttons - Minimal */}
              <div className="flex space-x-3">
                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-xl transition-all duration-300 hover:scale-105 px-4 py-2 rounded-xl"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Fullscreen</span>
                </Button>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  className="relative"
                >
                <Button
                  onClick={onPromoteToTrip}
                  disabled={isPromoting}
                    className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600 text-black font-bold shadow-2xl hover:shadow-amber-500/40 transition-all duration-500 px-6 py-2 text-sm rounded-xl border border-amber-300/30 relative overflow-hidden group"
                >
                    {/* Animated background shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                  {isPromoting ? (
                    <>
                        <motion.div 
                          className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Promoting...</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ 
                            y: [0, -2, 0],
                            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          <Plane className="h-4 w-4 mr-2" />
                        </motion.div>
                        <span>Promote to Trip</span>
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Delete button - only show for idea creator */}
                {currentUserId && idea.author && currentUserId === idea.author.id && onDelete && (
                  <Button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold shadow-2xl hover:shadow-red-500/30 transition-all duration-300 px-6 py-2 text-sm rounded-xl border border-red-400/30 hover:scale-105"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        <span>Deleting...</span>
                    </>
                  ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete Idea</span>
                      </>
                  )}
                </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Minimal Image Controls - Bottom Right */}
        {idea.images.length > 1 && (
          <motion.div 
            className="absolute bottom-4 right-4 z-30"
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  rotate: -5,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ 
                  scale: 0.9,
                  rotate: 0,
                  transition: { duration: 0.1 }
                }}
                className="relative group"
              >
              <Button
                onClick={prevImage}
                variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md rounded-full w-8 h-8 shadow-lg hover:shadow-white/10 transition-all duration-500 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: [0, -1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.div>
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1.5, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
              </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ 
                  scale: 0.9,
                  transition: { duration: 0.1 }
                }}
                className="relative group"
              >
              <Button
                onClick={togglePlayPause}
                variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md rounded-full w-8 h-8 shadow-lg hover:shadow-white/10 transition-all duration-500 relative overflow-hidden"
                >
                  <motion.div
                    animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </motion.div>
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1.5, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
              </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              <Button
                onClick={nextImage}
                variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/30 text-white border border-white/10 backdrop-blur-md rounded-full w-8 h-8 shadow-lg hover:shadow-white/5 transition-all duration-500"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Button
                  onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                  variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/30 text-white border border-white/10 backdrop-blur-md rounded-full w-8 h-8 shadow-lg hover:shadow-white/5 transition-all duration-500"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Minimal Image Indicators - Bottom Left */}
        {idea.images.length > 1 && (
          <motion.div 
            className="absolute bottom-4 left-4 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <div className="flex space-x-1 bg-black/20 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
              {idea.images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    index === currentImageIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Minimal Bottom Panel - Maximum Image Focus */}
        <motion.div 
          className="mt-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        >
          {/* Title and Description - Overlay on Image with Adaptive Background */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
                className="text-center lg:text-left"
              >
                {/* Adaptive text background for enhanced readability */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl -m-4 p-4"></div>
                  <h1 className="relative text-hero lg:text-8xl font-display text-white mb-4 text-balance leading-none drop-shadow-2xl">
                    {idea.title}
                  </h1>
                  </div>
                
                <div className="relative inline-block max-w-4xl">
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl -m-3 p-3"></div>
                  <p className="relative text-subtitle lg:text-title text-white/95 max-w-4xl text-balance mb-6 drop-shadow-xl">
                    {idea.prompt}
                  </p>
                  </div>
                
                {/* Elegant Metadata - Floating Integration */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
                  className="flex items-center justify-center lg:justify-start space-x-6 mb-8"
                >
                  {/* Date with elegant styling */}
                  <motion.div 
                    className="flex items-center space-x-2 group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-white/60 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    <span className="text-caption font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                      {formatDate(idea.createdAt)}
                    </span>
                  </motion.div>
                  
                  {/* Author with premium styling */}
                  <motion.div 
                    className="flex items-center space-x-3 group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="w-7 h-7 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <span className="text-xs font-bold text-white">{idea.author.name.charAt(0)}</span>
                    </motion.div>
                    <span className="text-caption font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                      by {idea.author.name}
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
                      </div>
                    </div>

          {/* Mobile Content Panel - Ultra Minimal */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.4 }}
              className="bg-gradient-to-t from-black/40 via-black/20 to-transparent backdrop-blur-sm p-4"
            >
              {/* Ultra-minimal voting - floating buttons */}
              <div className="flex justify-center gap-2 mb-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onVote('up')}
                  disabled={isVoting}
                  className="w-12 h-12 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-md rounded-full border border-green-500/30 flex items-center justify-center transition-all duration-300"
                >
                  <Heart className="h-5 w-5 text-green-400" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onVote('maybe')}
                  disabled={isVoting}
                  className="w-12 h-12 bg-yellow-500/20 hover:bg-yellow-500/30 backdrop-blur-md rounded-full border border-yellow-500/30 flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-yellow-400 font-bold text-lg">?</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onVote('down')}
                  disabled={isVoting}
                  className="w-12 h-12 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md rounded-full border border-red-500/30 flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-red-400 font-bold text-lg">✕</span>
                </motion.button>
              </div>

              {/* Minimal action bar */}
              <div className="flex justify-center gap-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="text-white/70 hover:text-white transition-colors duration-300"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="text-white/70 hover:text-white transition-colors duration-300"
                >
                  <Download className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Ultra-Minimal Desktop Panel - Only on Desktop */}
          <div className="hidden lg:block absolute bottom-8 right-8 z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.4 }}
              className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10"
            >
              {/* Minimal voting - horizontal layout */}
              <div className="flex gap-2 mb-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                      onClick={() => onVote('up')}
                      disabled={isVoting}
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50 backdrop-blur-md rounded-xl transition-all duration-300 text-sm font-medium"
                >
                  <Heart className="h-4 w-4 inline mr-1" />
                  {localVotes.up}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                      onClick={() => onVote('maybe')}
                      disabled={isVoting}
                  className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/50 backdrop-blur-md rounded-xl transition-all duration-300 text-sm font-medium"
                >
                  ? {localVotes.maybe}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                      onClick={() => onVote('down')}
                      disabled={isVoting}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50 backdrop-blur-md rounded-xl transition-all duration-300 text-sm font-medium"
                >
                  ✕ {localVotes.down}
                </motion.button>
              </div>

              {/* Minimal actions */}
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-xl transition-all duration-300 text-sm"
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-xl transition-all duration-300 text-sm"
                >
                  <Download className="h-4 w-4" />
                </motion.button>
                  </div>
            </motion.div>
                </div>
        </motion.div>

        {/* Organic Mood Colors - Floating Integration */}
        {idea.palette && idea.palette.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.6 }}
            className="absolute bottom-8 right-8 z-20 hidden lg:block"
          >
            <div className="relative group">
              {/* Organic floating background */}
              <motion.div
                className="bg-black/10 backdrop-blur-xl rounded-3xl p-5 border border-white/5"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(0,0,0,0.15)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className="text-white/70 text-xs font-medium mb-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  Mood Palette
                </motion.div>
                
                {/* Organic color arrangement */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {idea.palette.slice(0, 5).map((color, index) => (
                    <motion.div
                      key={color}
                      initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 1.8 + (index * 0.15),
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ 
                        scale: 1.3, 
                        rotate: 5,
                        z: 10,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <div 
                        className="w-7 h-7 rounded-full border-2 border-white/30 shadow-2xl cursor-pointer relative overflow-hidden"
                        style={{ backgroundColor: color }}
                      >
                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                      
                      {/* Floating tooltip */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
                      >
                        {color}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
