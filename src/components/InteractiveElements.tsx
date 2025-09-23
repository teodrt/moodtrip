'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Heart, Star, ThumbsUp, ThumbsDown, MessageCircle, Share2, Bookmark, Eye } from 'lucide-react'
import { 
  buttonVariants, 
  iconVariants, 
  scaleIn, 
  fadeInUp, 
  bounceIn,
  shakeVariants,
  glowVariants
} from '@/lib/animations'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
  iconPosition = 'left'
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const getVariantStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }

    const variantStyles = {
      primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg hover:shadow-xl'
    }

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
  }

  return (
    <motion.button
      className={getVariantStyles()}
      onClick={onClick}
      disabled={disabled || loading}
      variants={buttonVariants}
      initial="rest"
      whileHover={disabled ? "rest" : "hover"}
      whileTap={disabled ? "rest" : "tap"}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {loading && (
        <motion.div
          className="mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </motion.div>
      )}
      
      {icon && iconPosition === 'left' && (
        <motion.span className="mr-2" variants={iconVariants}>
          {icon}
        </motion.span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <motion.span className="ml-2" variants={iconVariants}>
          {icon}
        </motion.span>
      )}
    </motion.button>
  )
}

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  onHover?: () => void
  onLeave?: () => void
}

export function InteractiveCard({
  children,
  className = '',
  hoverable = true,
  clickable = false,
  onClick,
  onHover,
  onLeave
}: InteractiveCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
      variants={{
        rest: { scale: 1, y: 0 },
        hover: hoverable ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 },
        tap: clickable ? { scale: 0.98 } : { scale: 1 }
      }}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

interface ReactionButtonProps {
  type: 'like' | 'love' | 'star' | 'bookmark' | 'share' | 'comment'
  count?: number
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
}

export function ReactionButton({
  type,
  count = 0,
  active = false,
  onClick,
  size = 'md',
  showCount = true
}: ReactionButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [localCount, setLocalCount] = useState(count)

  const getIcon = () => {
    switch (type) {
      case 'like': return <ThumbsUp className="w-4 h-4" />
      case 'love': return <Heart className="w-4 h-4" />
      case 'star': return <Star className="w-4 h-4" />
      case 'bookmark': return <Bookmark className="w-4 h-4" />
      case 'share': return <Share2 className="w-4 h-4" />
      case 'comment': return <MessageCircle className="w-4 h-4" />
      default: return <ThumbsUp className="w-4 h-4" />
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs'
      case 'md': return 'px-3 py-1.5 text-sm'
      case 'lg': return 'px-4 py-2 text-base'
      default: return 'px-3 py-1.5 text-sm'
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
      setIsAnimating(true)
      setLocalCount(prev => active ? prev - 1 : prev + 1)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return (
    <motion.button
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${getSizeStyles()} ${
        active 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
      }`}
      onClick={handleClick}
      variants={isAnimating ? bounceIn : buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate={isAnimating ? "visible" : "rest"}
    >
      <motion.span
        variants={iconVariants}
        animate={isAnimating ? { scale: [1, 1.3, 1] } : "rest"}
        transition={{ duration: 0.3 }}
      >
        {getIcon()}
      </motion.span>
      {showCount && (
        <motion.span
          key={localCount}
          initial={{ scale: 1 }}
          animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {localCount}
        </motion.span>
      )}
    </motion.button>
  )
}

interface FloatingActionButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent'
  tooltip?: string
}

export function FloatingActionButton({
  icon,
  onClick,
  position = 'bottom-right',
  size = 'md',
  color = 'primary',
  tooltip
}: FloatingActionButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-right': return 'bottom-6 right-6'
      case 'bottom-left': return 'bottom-6 left-6'
      case 'top-right': return 'top-6 right-6'
      case 'top-left': return 'top-6 left-6'
      default: return 'bottom-6 right-6'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'w-10 h-10'
      case 'md': return 'w-12 h-12'
      case 'lg': return 'w-14 h-14'
      default: return 'w-12 h-12'
    }
  }

  const getColorStyles = () => {
    switch (color) {
      case 'primary': return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
      case 'secondary': return 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md hover:shadow-lg'
      case 'accent': return 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl'
      default: return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
    }
  }

  return (
    <div className={`fixed z-50 ${getPositionStyles()}`}>
      <motion.button
        className={`${getSizeStyles()} ${getColorStyles()} rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        whileFocus="hover"
      >
        <motion.span
          variants={iconVariants}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap"
          >
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressIndicator({ steps, currentStep, className = '' }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isUpcoming = index > currentStep

        return (
          <div key={index} className="flex items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isCurrent 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              {isCompleted ? (
                <motion.svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </motion.svg>
              ) : (
                index + 1
              )}
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`flex-1 h-0.5 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

interface ConfettiProps {
  active: boolean
  onComplete?: () => void
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)]
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [active, onComplete])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: particle.x,
            top: particle.y
          }}
          animate={{
            y: window.innerHeight + 100,
            x: particle.x + (Math.random() - 0.5) * 200,
            rotate: 360,
            scale: [1, 1.2, 0.8, 0]
          }}
          transition={{
            duration: 3,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  )
}
