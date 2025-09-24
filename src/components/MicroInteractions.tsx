'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Sparkles, CheckCircle, ArrowRight, Plus, Eye, Info } from 'lucide-react'

// Interactive button with micro-interactions
interface InteractiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showParticles?: boolean
  showRipple?: boolean
  className?: string
}

export function InteractiveButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  showParticles = false,
  showRipple = true,
  className = '' 
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [showParticle, setShowParticle] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent) => {
    if (showRipple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setRipples(prev => [...prev, { id: Date.now(), x, y }])
      
      setTimeout(() => {
        setRipples(prev => prev.slice(1))
      }, 600)
    }

    if (showParticles) {
      setShowParticle(true)
      setTimeout(() => setShowParticle(false), 2000)
    }

    onClick?.()
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-900'
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm'
      case 'md':
        return 'px-4 py-2 text-base'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-base'
    }
  }

  return (
    <motion.button
      className={`relative overflow-hidden rounded-lg font-medium transition-all duration-200 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Particle effects */}
      <AnimatePresence>
        {showParticle && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1, 0],
                  opacity: [0, 1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -50, -100],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button content */}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.span>
    </motion.button>
  )
}

// Card with hover reveal animations
interface RevealCardProps {
  children: React.ReactNode
  revealContent: React.ReactNode
  className?: string
}

export function RevealCard({ children, revealContent, className = '' }: RevealCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Main content */}
      <motion.div
        animate={{ opacity: isHovered ? 0.7 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Reveal content */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {revealContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Voting button with particle effects
interface VotingButtonProps {
  isVoted: boolean
  onVote: () => void
  voteCount: number
  className?: string
}

export function VotingButton({ isVoted, onVote, voteCount, className = '' }: VotingButtonProps) {
  const [showParticles, setShowParticles] = useState(false)

  const handleVote = () => {
    if (!isVoted) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 2000)
    }
    onVote()
  }

  return (
    <motion.button
      className={`relative overflow-hidden rounded-full p-3 transition-all duration-200 ${
        isVoted 
          ? 'bg-red-500 text-white shadow-lg' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      } ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleVote}
    >
      {/* Particle effects */}
      <AnimatePresence>
        {showParticles && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-red-500"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1, 0],
                  opacity: [0, 1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 120],
                  y: [0, -60, -120],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                <Heart className="h-4 w-4" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex items-center gap-2"
        animate={isVoted ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart className={`h-5 w-5 ${isVoted ? 'fill-current' : ''}`} />
        <span className="font-medium">{voteCount}</span>
      </motion.div>
    </motion.button>
  )
}

// Success notification with celebration
interface SuccessNotificationProps {
  show: boolean
  message: string
  onClose: () => void
  className?: string
}

export function SuccessNotification({ show, message, onClose, className = '' }: SuccessNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-green-200 p-6 max-w-sm ${className}`}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <CheckCircle className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Success!</h4>
              <p className="text-gray-600 text-sm">{message}</p>
            </div>

            <motion.button
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>

          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + (i % 2) * 20}%`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 1.5,
                delay: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}