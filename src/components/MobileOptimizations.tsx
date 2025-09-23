'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { 
  SwipeUp, 
  SwipeDown, 
  SwipeLeft, 
  SwipeRight, 
  Pinch, 
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react'

// Touch gesture detection
export function useTouchGestures() {
  const [gestures, setGestures] = useState({
    swipeUp: false,
    swipeDown: false,
    swipeLeft: false,
    swipeRight: false,
    pinch: false,
    tap: false,
    longPress: false
  })

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // Long press detection
    longPressTimer.current = setTimeout(() => {
      setGestures(prev => ({ ...prev, longPress: true }))
    }, 500)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const deltaTime = Date.now() - touchStart.current.time

    // Clear long press if moved
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    // Swipe detection
    if (deltaTime < 300 && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        setGestures(prev => ({ ...prev, swipeRight: true }))
      } else {
        setGestures(prev => ({ ...prev, swipeLeft: true }))
      }
    }

    if (deltaTime < 300 && Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        setGestures(prev => ({ ...prev, swipeDown: true }))
      } else {
        setGestures(prev => ({ ...prev, swipeUp: true }))
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (!touchStart.current) return

    const deltaTime = Date.now() - touchStart.current.time

    // Tap detection
    if (deltaTime < 200) {
      setGestures(prev => ({ ...prev, tap: true }))
    }

    touchStart.current = null
  }

  const resetGestures = () => {
    setGestures({
      swipeUp: false,
      swipeDown: false,
      swipeLeft: false,
      swipeRight: false,
      pinch: false,
      tap: false,
      longPress: false
    })
  }

  return {
    gestures,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetGestures
  }
}

// Swipeable card component
interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 100,
  className = ''
}: SwipeableCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-30, 30])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info

    if (Math.abs(offset.x) > threshold) {
      if (offset.x > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    } else if (Math.abs(offset.y) > threshold) {
      if (offset.y > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    } else {
      // Snap back to center
      x.set(0)
      y.set(0)
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ x, y, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
    >
      {children}
    </motion.div>
  )
}

// Pull to refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const y = useMotionValue(0)
  const rotate = useTransform(y, [0, threshold], [0, 180])
  const scale = useTransform(y, [0, threshold], [0.8, 1])

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true)
      await onRefresh()
      setIsRefreshing(false)
    }
    y.set(0)
    setPullDistance(0)
  }

  const handleDrag = (event: any, info: PanInfo) => {
    if (info.offset.y > 0) {
      setPullDistance(Math.min(info.offset.y, threshold * 1.5))
    }
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4"
        style={{ y: -50, opacity: pullDistance / threshold }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          style={{ rotate, scale }}
          animate={isRefreshing ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
        />
      </motion.div>

      <motion.div
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Mobile navigation drawer
interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  side?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export function MobileDrawer({
  isOpen,
  onClose,
  children,
  side = 'left',
  className = ''
}: MobileDrawerProps) {
  const x = useMotionValue(side === 'left' ? -300 : side === 'right' ? 300 : 0)
  const y = useMotionValue(side === 'top' ? -300 : side === 'bottom' ? 300 : 0)

  useEffect(() => {
    if (isOpen) {
      x.set(0)
      y.set(0)
    } else {
      if (side === 'left') x.set(-300)
      else if (side === 'right') x.set(300)
      else if (side === 'top') y.set(-300)
      else if (side === 'bottom') y.set(300)
    }
  }, [isOpen, side, x, y])

  const getDrawerStyles = () => {
    switch (side) {
      case 'left':
        return 'left-0 top-0 h-full w-80'
      case 'right':
        return 'right-0 top-0 h-full w-80'
      case 'top':
        return 'top-0 left-0 w-full h-80'
      case 'bottom':
        return 'bottom-0 left-0 w-full h-80'
      default:
        return 'left-0 top-0 h-full w-80'
    }
  }

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      <motion.div
        className={`fixed ${getDrawerStyles()} bg-white shadow-xl z-50 ${className}`}
        style={{ x, y }}
        initial={false}
        animate={isOpen ? { x: 0, y: 0 } : {}}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {children}
      </motion.div>
    </>
  )
}

// Device detection hook
export function useDeviceDetection() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      setIsTouch(isTouchDevice)

      if (width < 768) {
        setDevice('mobile')
      } else if (width < 1024) {
        setDevice('tablet')
      } else {
        setDevice('desktop')
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { device, isTouch }
}

// Mobile-optimized button
interface MobileButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  loading?: boolean
}

export function MobileButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false
}: MobileButtonProps) {
  const { isTouch } = useDeviceDetection()

  const getSizeStyles = () => {
    const baseStyles = isTouch ? 'min-h-[44px]' : 'min-h-[36px]' // Touch target minimum
    
    switch (size) {
      case 'sm':
        return `${baseStyles} px-3 py-2 text-sm`
      case 'md':
        return `${baseStyles} px-4 py-3 text-base`
      case 'lg':
        return `${baseStyles} px-6 py-4 text-lg`
      default:
        return `${baseStyles} px-4 py-3 text-base`
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300'
      case 'ghost':
        return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
    }
  }

  return (
    <motion.button
      className={`
        ${getSizeStyles()}
        ${getVariantStyles()}
        rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
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
      {children}
    </motion.button>
  )
}

// Mobile-optimized input
interface MobileInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  className?: string
  disabled?: boolean
  error?: string
}

export function MobileInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  disabled = false,
  error
}: MobileInputProps) {
  const { isTouch } = useDeviceDetection()

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-base rounded-lg border transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${isTouch ? 'min-h-[44px]' : 'min-h-[36px]'}
          ${className}
        `}
        style={{
          fontSize: isTouch ? '16px' : '14px', // Prevent zoom on iOS
        }}
      />
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// Mobile-optimized modal
interface MobileModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function MobileModal({
  isOpen,
  onClose,
  children,
  title,
  className = ''
}: MobileModalProps) {
  const { device } = useDeviceDetection()

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`
          bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden
          ${device === 'mobile' ? 'rounded-t-2xl' : 'rounded-2xl'}
          ${className}
        `}
        initial={{ y: device === 'mobile' ? '100%' : 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: device === 'mobile' ? '100%' : 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
        )}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Haptic feedback utility
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[type])
    }
  }

  return { triggerHaptic }
}

// Safe area handling
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  })

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0')
      })
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)
    return () => window.removeEventListener('resize', updateSafeArea)
  }, [])

  return safeArea
}
