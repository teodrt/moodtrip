'use client'

import { motion } from 'framer-motion'
import { Loader2, Sparkles, Image, Users, Calendar, Zap, Heart, Star } from 'lucide-react'
import { loadingVariants, pulseVariants, fadeInUp, scaleIn } from '@/lib/animations'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'default' | 'pulse' | 'bounce'
}

export function LoadingSpinner({ size = 'md', className = '', variant = 'default' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const getVariants = () => {
    switch (variant) {
      case 'pulse':
        return pulseVariants
      case 'bounce':
        return scaleIn
      default:
        return loadingVariants
    }
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      variants={getVariants()}
      animate="animate"
    >
      <Loader2 className="h-full w-full" />
    </motion.div>
  )
}

interface IdeaCardSkeletonProps {
  className?: string
  variant?: 'default' | 'minimal' | 'detailed'
}

export function IdeaCardSkeleton({ className = '', variant = 'default' }: IdeaCardSkeletonProps) {
  const getSkeletonContent = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        )
      case 'detailed':
        return (
          <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="flex flex-wrap gap-1.5">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="relative aspect-[4/3] bg-gray-200">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      {getSkeletonContent()}
    </motion.div>
  )
}

interface MoodboardGenerationProps {
  step: 'images' | 'summary' | 'tags' | 'palette' | 'complete'
  progress?: number
}

export function MoodboardGeneration({ step, progress = 0 }: MoodboardGenerationProps) {
  const steps = [
    { key: 'images', label: 'Generating Images', icon: Image },
    { key: 'summary', label: 'Creating Summary', icon: Sparkles },
    { key: 'tags', label: 'Extracting Tags', icon: Users },
    { key: 'palette', label: 'Analyzing Colors', icon: Calendar },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === step)
  const isComplete = step === 'complete'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={isComplete ? {} : { rotate: 360 }}
            transition={{ duration: 2, repeat: isComplete ? 0 : Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {isComplete ? 'Moodboard Complete!' : 'Creating Your Moodboard'}
          </h3>
          <p className="text-gray-600">
            {isComplete 
              ? 'Your travel vision has been brought to life!' 
              : 'This may take a few moments...'
            }
          </p>
        </div>

        {!isComplete && (
          <div className="space-y-4">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon
              const isActive = index === currentStepIndex
              const isCompleted = index < currentStepIndex
              
              return (
                <motion.div
                  key={stepItem.key}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-purple-50 border border-purple-200' : 
                    isCompleted ? 'bg-green-50 border border-green-200' : 
                    'bg-gray-50 border border-gray-200'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-purple-500' : 
                    isCompleted ? 'bg-green-500' : 
                    'bg-gray-300'
                  }`}>
                    {isActive ? (
                      <LoadingSpinner size="sm" className="text-white" />
                    ) : isCompleted ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isActive ? 'text-purple-900' : 
                    isCompleted ? 'text-green-900' : 
                    'text-gray-500'
                  }`}>
                    {stepItem.label}
                  </span>
                </motion.div>
              )
            })}
            
            {progress > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">Your moodboard is ready to view!</p>
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Moodboard
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600">Please wait while we prepare everything for you...</p>
      </div>
    </div>
  )
}