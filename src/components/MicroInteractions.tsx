'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Hover effects
interface HoverScaleProps {
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
}

export function HoverScale({ children, scale = 1.05, duration = 0.2, className }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface HoverLiftProps {
  children: React.ReactNode
  lift?: number
  shadow?: string
  className?: string
}

export function HoverLift({ children, lift = 8, shadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)', className }: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -lift,
        boxShadow: shadow
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Click animations
interface ClickRippleProps {
  children: React.ReactNode
  color?: string
  duration?: number
  className?: string
}

export function ClickRipple({ children, color = 'rgba(59, 130, 246, 0.3)', duration = 0.6, className }: ClickRippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, duration * 1000)
  }

  return (
    <div
      className={cn('relative overflow-hidden cursor-pointer', className)}
      onClick={handleClick}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: color,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            width: 200,
            height: 200,
            opacity: [0.6, 0]
          }}
          transition={{ duration, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// Loading animations
interface PulseProps {
  children: React.ReactNode
  intensity?: number
  duration?: number
  className?: string
}

export function Pulse({ children, intensity = 0.1, duration = 2, className }: PulseProps) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1 + intensity, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ShakeProps {
  children: React.ReactNode
  intensity?: number
  duration?: number
  trigger?: boolean
  className?: string
}

export function Shake({ children, intensity = 10, duration = 0.5, trigger = false, className }: ShakeProps) {
  return (
    <motion.div
      animate={trigger ? {
        x: [-intensity, intensity, -intensity, intensity, 0],
        transition: { duration, ease: 'easeInOut' }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll animations
interface FadeInProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, direction = 'up', delay = 0, duration = 0.6, className }: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const directionVariants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 }
  }

  const variants = {
    hidden: directionVariants[direction],
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  stagger?: number
  className?: string
}

export function StaggerContainer({ children, stagger = 0.1, className }: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Focus animations
interface FocusRingProps {
  children: React.ReactNode
  color?: string
  size?: number
  className?: string
}

export function FocusRing({ children, color = 'rgba(59, 130, 246, 0.5)', size = 4, className }: FocusRingProps) {
  return (
    <motion.div
      whileFocus={{
        boxShadow: `0 0 0 ${size}px ${color}`,
        scale: 1.02
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Success animations
interface SuccessCheckmarkProps {
  isVisible: boolean
  size?: number
  color?: string
  className?: string
}

export function SuccessCheckmark({ isVisible, size = 24, color = '#10B981', className }: SuccessCheckmarkProps) {
  return (
    <motion.div
      initial={false}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        hidden: { scale: 0, opacity: 0 },
        visible: { 
          scale: 1, 
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30
          }
        }
      }}
      className={className}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M20 6L9 17l-5-5"
          initial={{ pathLength: 0 }}
          animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </motion.svg>
    </motion.div>
  )
}

// Floating animation
interface FloatingProps {
  children: React.ReactNode
  intensity?: number
  duration?: number
  className?: string
}

export function Floating({ children, intensity = 10, duration = 3, className }: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [-intensity, intensity, -intensity],
        rotate: [-1, 1, -1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Magnetic effect
interface MagneticProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export function Magnetic({ children, intensity = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * intensity
    const deltaY = (e.clientY - centerY) * intensity

    ref.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('transition-transform duration-200 ease-out', className)}
    >
      {children}
    </div>
  )
}

// Parallax effect
interface ParallaxProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export function Parallax({ children, offset = 50, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const scrolled = window.pageYOffset
      const rate = scrolled * -0.5
      ref.current.style.transform = `translateY(${rate}px)`
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
