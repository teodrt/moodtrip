'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plane, Luggage, FileText, MapPin, Camera, Compass } from 'lucide-react'

interface TravelLoadingProps {
  type: 'airplane' | 'suitcase' | 'passport' | 'map' | 'camera' | 'compass'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TravelLoadingAnimation({ type, size = 'md', className = '' }: TravelLoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const getIcon = () => {
    switch (type) {
      case 'airplane':
        return <Plane className={sizeClasses[size]} />
      case 'suitcase':
        return <Luggage className={sizeClasses[size]} />
      case 'passport':
        return <FileText className={sizeClasses[size]} />
      case 'map':
        return <MapPin className={sizeClasses[size]} />
      case 'camera':
        return <Camera className={sizeClasses[size]} />
      case 'compass':
        return <Compass className={sizeClasses[size]} />
      default:
        return <Plane className={sizeClasses[size]} />
    }
  }

  const getAnimationVariants = () => {
    switch (type) {
      case 'airplane':
        return {
          initial: { x: -100, y: 0, rotate: 0 },
          animate: {
            x: [0, 100, 0],
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }
      case 'suitcase':
        return {
          initial: { scale: 1, y: 0 },
          animate: {
            scale: [1, 1.1, 1],
            y: [0, -10, 0],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }
      case 'passport':
        return {
          initial: { rotate: 0, scale: 1 },
          animate: {
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
            transition: {
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }
      case 'map':
        return {
          initial: { scale: 1, rotate: 0 },
          animate: {
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
            transition: {
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }
      case 'camera':
        return {
          initial: { scale: 1, y: 0 },
          animate: {
            scale: [1, 1.15, 1],
            y: [0, -15, 0],
            transition: {
              duration: 1.7,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }
      case 'compass':
        return {
          initial: { rotate: 0 },
          animate: {
            rotate: [0, 360],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }
          }
        }
      default:
        return {
          initial: { scale: 1 },
          animate: {
            scale: [1, 1.1, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        }
    }
  }

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      variants={getAnimationVariants()}
      initial="initial"
      animate="animate"
    >
      {getIcon()}
    </motion.div>
  )
}

// Loading state component with multiple travel elements
interface TravelLoadingStateProps {
  message?: string
  showProgress?: boolean
  progress?: number
  className?: string
}

export function TravelLoadingState({ 
  message = "Preparing your journey...", 
  showProgress = false, 
  progress = 0,
  className = '' 
}: TravelLoadingStateProps) {
  const travelElements = ['airplane', 'suitcase', 'passport', 'map', 'camera', 'compass']
  
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
      {/* Animated travel elements */}
      <div className="relative w-32 h-32">
        {travelElements.map((element, index) => (
          <motion.div
            key={element}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          >
            <TravelLoadingAnimation 
              type={element as any} 
              size="md"
              className="text-blue-500"
            />
          </motion.div>
        ))}
      </div>

      {/* Loading message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600">Creating amazing travel experiences...</p>
      </motion.div>

      {/* Progress bar */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Page transition component
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Parallax scrolling component
interface ParallaxScrollProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxScroll({ children, speed = 0.5, className = '' }: ParallaxScrollProps) {
  return (
    <motion.div
      className={className}
      style={{
        transform: `translateY(${speed * 100}px)`
      }}
      whileInView={{
        y: 0,
        transition: {
          duration: 1,
          ease: "easeOut"
        }
      }}
    >
      {children}
    </motion.div>
  )
}
