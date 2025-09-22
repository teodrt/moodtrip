'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Sparkles, Plane, Heart, MessageCircle, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={cn('text-blue-500', sizeClasses[size])}
      >
        <Loader2 className="h-full w-full" />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

interface SkeletonLoaderProps {
  count?: number
  className?: string
  variant?: 'card' | 'text' | 'image' | 'button'
}

export function SkeletonLoader({ count = 3, className, variant = 'card' }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="space-y-3">
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
            </div>
          </div>
        )
      case 'text':
        return (
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        )
      case 'image':
        return <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      case 'button':
        return <div className="h-10 bg-gray-200 rounded animate-pulse w-24" />
      default:
        return <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  )
}

interface IdeaGenerationLoaderProps {
  stage: 'images' | 'summary' | 'tags' | 'palette' | 'complete'
  progress: number
}

export function IdeaGenerationLoader({ stage, progress }: IdeaGenerationLoaderProps) {
  const stages = {
    images: { icon: ImageIcon, text: 'Generating stunning images...', color: 'text-blue-500' },
    summary: { icon: Sparkles, text: 'Creating AI summary...', color: 'text-purple-500' },
    tags: { icon: Heart, text: 'Extracting relevant tags...', color: 'text-pink-500' },
    palette: { icon: MessageCircle, text: 'Analyzing color palette...', color: 'text-green-500' },
    complete: { icon: Plane, text: 'Idea ready!', color: 'text-emerald-500' }
  }

  const currentStage = stages[stage]
  const Icon = currentStage.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-6 p-8"
    >
      {/* Animated Icon */}
      <motion.div
        animate={{ 
          scale: stage === 'complete' ? [1, 1.2, 1] : [1, 1.1, 1],
          rotate: stage === 'complete' ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          duration: stage === 'complete' ? 0.6 : 2,
          repeat: stage === 'complete' ? 0 : Infinity,
          ease: 'easeInOut'
        }}
        className={cn('p-4 rounded-full bg-gradient-to-br from-blue-50 to-purple-50', currentStage.color)}
      >
        <Icon className="h-8 w-8" />
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{currentStage.text}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex space-x-2">
        {Object.keys(stages).map((stageKey, index) => {
          const isActive = stageKey === stage
          const isCompleted = Object.keys(stages).indexOf(stage) > index
          const StageIcon = stages[stageKey as keyof typeof stages].icon
          
          return (
            <motion.div
              key={stageKey}
              animate={{ 
                scale: isActive ? 1.2 : 1,
                opacity: isActive || isCompleted ? 1 : 0.5
              }}
              className={cn(
                'p-2 rounded-full transition-colors',
                isActive ? 'bg-blue-100 text-blue-600' : 
                isCompleted ? 'bg-green-100 text-green-600' : 
                'bg-gray-100 text-gray-400'
              )}
            >
              <StageIcon className="h-4 w-4" />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

interface ShimmerEffectProps {
  className?: string
  children: React.ReactNode
}

export function ShimmerEffect({ className, children }: ShimmerEffectProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

interface PulseLoaderProps {
  dots?: number
  className?: string
  color?: string
}

export function PulseLoader({ dots = 3, className, color = 'bg-blue-500' }: PulseLoaderProps) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {Array.from({ length: dots }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('h-2 w-2 rounded-full', color)}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

interface OverlayLoaderProps {
  isVisible: boolean
  message?: string
  progress?: number
  onCancel?: () => void
}

export function OverlayLoader({ isVisible, message, progress, onCancel }: OverlayLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl"
          >
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              {message && (
                <p className="text-gray-700 font-medium">{message}</p>
              )}
              {progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
