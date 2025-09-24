'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Sparkles } from 'lucide-react'

interface ParticleEffectProps {
  type: 'heart' | 'star' | 'confetti'
  trigger: boolean
  onComplete?: () => void
  className?: string
}

export function ParticleEffect({ type, trigger, onComplete, className = '' }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        delay: i * 0.1
      }))
      setParticles(newParticles)
      
      // Clear particles after animation
      setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)
    }
  }, [trigger, onComplete])

  const getParticleIcon = () => {
    switch (type) {
      case 'heart':
        return <Heart className="h-6 w-6 text-red-500" />
      case 'star':
        return <Star className="h-6 w-6 text-yellow-500" />
      case 'confetti':
        return <Sparkles className="h-6 w-6 text-purple-500" />
      default:
        return <Heart className="h-6 w-6 text-red-500" />
    }
  }

  const getParticleVariants = () => {
    const baseVariant = {
      initial: { 
        scale: 0, 
        opacity: 0, 
        x: 0, 
        y: 0,
        rotate: 0
      },
      animate: {
        scale: [0, 1.2, 1, 0],
        opacity: [0, 1, 1, 0],
        x: [0, 0, 0, 0],
        y: [0, -50, -100, -150],
        rotate: [0, 180, 360, 720],
        transition: {
          duration: 2.5,
          ease: "easeOut"
        }
      }
    }

    switch (type) {
      case 'heart':
        return {
          ...baseVariant,
          animate: {
            ...baseVariant.animate,
            x: [0, -20, 20, -10, 10, 0],
            y: [0, -30, -50, -70, -100],
            rotate: [0, 15, -15, 30, -30, 0]
          }
        }
      case 'star':
        return {
          ...baseVariant,
          animate: {
            ...baseVariant.animate,
            x: [0, -25, 25, -15, 15, 0],
            y: [0, -35, -60, -85, -120],
            rotate: [0, 180, 360, 720]
          }
        }
      case 'confetti':
        return {
          ...baseVariant,
          animate: {
            ...baseVariant.animate,
            x: [0, -30, 30, -20, 20, 0],
            y: [0, -40, -70, -100, -130],
            rotate: [0, 360, 720, 1080]
          }
        }
      default:
        return baseVariant
    }
  }

  return (
    <div className={`absolute inset-0 pointer-events-none z-50 ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            variants={getParticleVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              delay: particle.delay,
              duration: 2.5,
              ease: "easeOut"
            }}
          >
            {getParticleIcon()}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Success celebration component
interface SuccessCelebrationProps {
  trigger: boolean
  onComplete?: () => void
  className?: string
}

export function SuccessCelebration({ trigger, onComplete, className = '' }: SuccessCelebrationProps) {
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (trigger) {
      setShowCelebration(true)
      setTimeout(() => {
        setShowCelebration(false)
        onComplete?.()
      }, 2000)
    }
  }, [trigger, onComplete])

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          className={`fixed inset-0 pointer-events-none z-50 flex items-center justify-center ${className}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-green-400/20 via-green-300/10 to-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Checkmark */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <motion.svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>
          </motion.div>

          {/* Sparkles around checkmark */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ 
                scale: 0, 
                x: 0, 
                y: 0,
                rotate: 0
              }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * 60) * Math.PI / 180) * 60,
                y: Math.sin((i * 60) * Math.PI / 180) * 60,
                rotate: 360
              }}
              transition={{
                delay: 0.3 + i * 0.1,
                duration: 1.5,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Ripple effect component
interface RippleEffectProps {
  trigger: boolean
  onComplete?: () => void
  className?: string
}

export function RippleEffect({ trigger, onComplete, className = '' }: RippleEffectProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (trigger) {
      const newRipple = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100
      }
      setRipples([newRipple])
      
      setTimeout(() => {
        setRipples([])
        onComplete?.()
      }, 600)
    }
  }, [trigger, onComplete])

  return (
    <div className={`absolute inset-0 pointer-events-none z-50 ${className}`}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-blue-500/30 rounded-full"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
