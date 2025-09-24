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
  variant?: 'primary' | 'secondary' | 'ghost' | 'premium' | 'glass' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  disabled?: boolean
  loading?: boolean
  gradient?: 'primary' | 'sunset' | 'ocean' | 'forest' | 'aurora' | 'midnight' | 'gold' | 'rose' | 'cosmic'
  haptic?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function MobileButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  gradient = 'primary',
  haptic = true,
  icon,
  iconPosition = 'left'
}: MobileButtonProps) {
  const { isTouch } = useDeviceDetection()
  const { triggerHaptic } = useHapticFeedback()

  const getSizeStyles = () => {
    const baseStyles = isTouch ? 'min-h-[44px]' : 'min-h-[36px]' // Touch target minimum
    
    switch (size) {
      case 'sm':
        return `${baseStyles} px-3 py-2 text-sm`
      case 'md':
        return `${baseStyles} px-4 py-3 text-base`
      case 'lg':
        return `${baseStyles} px-6 py-4 text-lg`
      case 'xl':
        return `${baseStyles} px-8 py-5 text-xl`
      default:
        return `${baseStyles} px-4 py-3 text-base`
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
      case 'secondary':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg'
      case 'ghost':
        return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
      case 'premium':
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl'
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 shadow-2xl'
      case 'gradient':
        return `bg-gradient-to-r ${gradient === 'primary' ? 'from-blue-500 to-purple-600' : 
                gradient === 'sunset' ? 'from-pink-500 to-red-500' :
                gradient === 'ocean' ? 'from-cyan-500 to-blue-500' :
                gradient === 'forest' ? 'from-green-500 to-emerald-500' :
                gradient === 'aurora' ? 'from-purple-500 to-pink-500' :
                gradient === 'midnight' ? 'from-slate-500 to-gray-500' :
                gradient === 'gold' ? 'from-yellow-500 to-orange-500' :
                gradient === 'rose' ? 'from-rose-500 to-pink-500' :
                gradient === 'cosmic' ? 'from-blue-500 via-purple-500 to-pink-500' :
                'from-blue-500 to-purple-600'} text-white shadow-lg hover:shadow-xl`
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
    }
  }

  const handleClick = () => {
    if (haptic && isTouch) {
      triggerHaptic('light')
    }
    onClick?.()
  }

  return (
    <motion.button
      className={`
        ${getSizeStyles()}
        ${getVariantStyles()}
        rounded-xl font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
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
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {icon}
        </motion.span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {icon}
        </motion.span>
      )}
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
  variant?: 'default' | 'glass' | 'premium' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  haptic?: boolean
}

export function MobileInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  disabled = false,
  error,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  haptic = true
}: MobileInputProps) {
  const { isTouch } = useDeviceDetection()
  const { triggerHaptic } = useHapticFeedback()

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20'
      case 'premium':
        return 'bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border border-white/30 shadow-lg focus:border-blue-500 focus:ring-blue-500/20'
      case 'floating':
        return 'bg-white/95 backdrop-blur-xl border border-gray-200 shadow-lg focus:border-blue-500 focus:ring-blue-500/20 focus:shadow-xl'
      default:
        return 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
    }
  }

  const getSizeStyles = () => {
    const baseStyles = isTouch ? 'min-h-[44px]' : 'min-h-[36px]'
    
    switch (size) {
      case 'sm': return `${baseStyles} px-3 py-2 text-sm`
      case 'md': return `${baseStyles} px-4 py-3 text-base`
      case 'lg': return `${baseStyles} px-4 py-4 text-lg`
      default: return `${baseStyles} px-4 py-3 text-base`
    }
  }

  const handleFocus = () => {
    if (haptic && isTouch) {
      triggerHaptic('light')
    }
  }

  return (
    <div className="relative">
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={handleFocus}
        className={`
          w-full rounded-xl border transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${icon && iconPosition === 'left' ? 'pl-10' : ''}
          ${icon && iconPosition === 'right' ? 'pr-10' : ''}
          ${className}
        `}
        style={{
          fontSize: isTouch ? '16px' : '14px', // Prevent zoom on iOS
        }}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      {icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
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
  variant?: 'default' | 'glass' | 'premium' | 'floating'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  haptic?: boolean
}

export function MobileModal({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  variant = 'default',
  size = 'md',
  haptic = true
}: MobileModalProps) {
  const { device } = useDeviceDetection()
  const { triggerHaptic } = useHapticFeedback()

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl'
      case 'premium':
        return 'bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/30 shadow-2xl'
      case 'floating':
        return 'bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl'
      default:
        return 'bg-white shadow-xl'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'max-w-sm'
      case 'md': return 'max-w-md'
      case 'lg': return 'max-w-lg'
      case 'xl': return 'max-w-xl'
      case 'full': return 'max-w-full mx-4'
      default: return 'max-w-md'
    }
  }

  const handleClose = () => {
    if (haptic && device === 'mobile') {
      triggerHaptic('light')
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <motion.div
        className={`
          ${getVariantStyles()}
          ${getSizeStyles()}
          w-full max-h-[90vh] overflow-hidden
          ${device === 'mobile' ? 'rounded-t-2xl' : 'rounded-2xl'}
          ${className}
        `}
        initial={{ y: device === 'mobile' ? '100%' : 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: device === 'mobile' ? '100%' : 50, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200/50">
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

// Mobile-optimized navigation bar
interface MobileNavBarProps {
  title?: string
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  variant?: 'default' | 'glass' | 'premium'
  className?: string
}

export function MobileNavBar({
  title,
  leftAction,
  rightAction,
  variant = 'default',
  className = ''
}: MobileNavBarProps) {
  const { device } = useDeviceDetection()
  const safeArea = useSafeArea()

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border-b border-white/20'
      case 'premium':
        return 'bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border-b border-white/30 shadow-lg'
      default:
        return 'bg-white border-b border-gray-200'
    }
  }

  return (
    <motion.div
      className={`
        fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3
        ${getVariantStyles()}
        ${className}
      `}
      style={{
        paddingTop: `${safeArea.top + 12}px`,
        paddingBottom: '12px'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center">
        {leftAction}
      </div>
      
      {title && (
        <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">
          {title}
        </h1>
      )}
      
      <div className="flex items-center">
        {rightAction}
      </div>
    </motion.div>
  )
}

// Mobile-optimized bottom navigation
interface MobileBottomNavProps {
  items: Array<{
    icon: React.ReactNode
    label: string
    active?: boolean
    onClick?: () => void
    badge?: number
  }>
  variant?: 'default' | 'glass' | 'premium'
  className?: string
}

export function MobileBottomNav({
  items,
  variant = 'default',
  className = ''
}: MobileBottomNavProps) {
  const { device } = useDeviceDetection()
  const safeArea = useSafeArea()
  const { triggerHaptic } = useHapticFeedback()

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border-t border-white/20'
      case 'premium':
        return 'bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border-t border-white/30 shadow-lg'
      default:
        return 'bg-white border-t border-gray-200'
    }
  }

  return (
    <motion.div
      className={`
        fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-4 py-2
        ${getVariantStyles()}
        ${className}
      `}
      style={{
        paddingBottom: `${safeArea.bottom + 8}px`,
        paddingTop: '8px'
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {items.map((item, index) => (
        <motion.button
          key={index}
          className={`
            flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
            ${item.active 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
          onClick={() => {
            triggerHaptic('light')
            item.onClick?.()
          }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            {item.icon}
            {item.badge && item.badge > 0 && (
              <motion.span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 200 }}
              >
                {item.badge > 99 ? '99+' : item.badge}
              </motion.span>
            )}
          </div>
          <span className="text-xs mt-1 font-medium">{item.label}</span>
        </motion.button>
      ))}
    </motion.div>
  )
}

// Mobile-optimized floating action button
interface MobileFABProps {
  icon: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'premium' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  haptic?: boolean
}

export function MobileFAB({
  icon,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  haptic = true
}: MobileFABProps) {
  const { triggerHaptic } = useHapticFeedback()

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-md hover:shadow-lg'
      case 'premium':
        return 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl'
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 shadow-2xl'
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12'
      case 'md': return 'w-14 h-14'
      case 'lg': return 'w-16 h-16'
      default: return 'w-14 h-14'
    }
  }

  return (
    <motion.button
      className={`
        fixed bottom-20 right-4 z-50 rounded-full flex items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      onClick={() => {
        if (haptic) {
          triggerHaptic('medium')
        }
        onClick?.()
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {icon}
    </motion.button>
  )
}
