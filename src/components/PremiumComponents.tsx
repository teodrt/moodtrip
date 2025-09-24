'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { 
  premiumHoverVariants, 
  premiumCardVariants, 
  premiumButtonVariants,
  premiumLoadingVariants,
  premiumStaggerContainer,
  premiumStaggerItem
} from '@/lib/animations'
import { triggerPremiumParticleEffect } from '@/lib/micro-interactions'
import { cn } from '@/lib/utils'

// Premium Card Component
interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  onHover?: () => void
  onLeave?: () => void
  variant?: 'default' | 'glass' | 'gradient' | 'elevated'
  gradient?: 'primary' | 'sunset' | 'ocean' | 'forest' | 'aurora' | 'midnight' | 'gold' | 'rose' | 'cosmic'
}

export function PremiumCard({
  children,
  className = '',
  hoverable = true,
  clickable = false,
  onClick,
  onHover,
  onLeave,
  variant = 'default',
  gradient = 'primary'
}: PremiumCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl'
      case 'gradient':
        return `bg-gradient-to-br ${gradient === 'primary' ? 'from-blue-500/20 to-purple-600/20' : 
                gradient === 'sunset' ? 'from-pink-500/20 to-red-500/20' :
                gradient === 'ocean' ? 'from-cyan-500/20 to-blue-500/20' :
                gradient === 'forest' ? 'from-green-500/20 to-emerald-500/20' :
                gradient === 'aurora' ? 'from-purple-500/20 to-pink-500/20' :
                gradient === 'midnight' ? 'from-slate-500/20 to-gray-500/20' :
                gradient === 'gold' ? 'from-yellow-500/20 to-orange-500/20' :
                gradient === 'rose' ? 'from-rose-500/20 to-pink-500/20' :
                gradient === 'cosmic' ? 'from-blue-500/20 via-purple-500/20 to-pink-500/20' :
                'from-blue-500/20 to-purple-600/20'} backdrop-blur-xl border border-white/20 shadow-2xl`
      case 'elevated':
        return 'bg-white shadow-2xl border border-gray-100'
      default:
        return 'bg-white shadow-lg border border-gray-200'
    }
  }

  return (
    <motion.div
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300',
        getVariantStyles(),
        hoverable && 'cursor-pointer',
        className
      )}
      variants={premiumCardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : "visible"}
      whileTap={clickable ? { scale: 0.98 } : "visible"}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true)
        onHover?.()
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onLeave?.()
      }}
    >
      {children}
    </motion.div>
  )
}

// Premium Button Component
interface PremiumButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  gradient?: 'primary' | 'sunset' | 'ocean' | 'forest' | 'aurora' | 'midnight' | 'gold' | 'rose' | 'cosmic'
  particleEffect?: boolean
}

export function PremiumButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
  iconPosition = 'left',
  gradient = 'primary',
  particleEffect = false
}: PremiumButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2 text-sm'
      case 'md': return 'px-6 py-3 text-base'
      case 'lg': return 'px-8 py-4 text-lg'
      case 'xl': return 'px-10 py-5 text-xl'
      default: return 'px-6 py-3 text-base'
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500'
      case 'ghost':
        return 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
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
                'from-blue-500 to-purple-600'} text-white focus:ring-blue-500`
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    }
  }

  const handleClick = () => {
    if (onClick && !disabled && !loading) {
      onClick()
      if (particleEffect && buttonRef.current) {
        triggerPremiumParticleEffect('confetti', buttonRef.current)
      }
    }
  }

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        getSizeStyles(),
        getVariantStyles(),
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      variants={premiumButtonVariants}
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
          variants={premiumLoadingVariants}
          animate="animate"
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        </motion.div>
      )}
      
      {icon && iconPosition === 'left' && (
        <motion.span
          className="mr-2"
          animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
        >
          {icon}
        </motion.span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <motion.span
          className="ml-2"
          animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  )
}

// Premium Loading Component
interface PremiumLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave'
  className?: string
}

export function PremiumLoading({
  size = 'md',
  variant = 'spinner',
  className = ''
}: PremiumLoadingProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4'
      case 'md': return 'w-6 h-6'
      case 'lg': return 'w-8 h-8'
      case 'xl': return 'w-12 h-12'
      default: return 'w-6 h-6'
    }
  }

  const renderVariant = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={cn('border-2 border-current border-t-transparent rounded-full', getSizeStyles())}
            variants={premiumLoadingVariants}
            animate="animate"
          />
        )
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn('bg-current rounded-full', getSizeStyles())}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )
      case 'pulse':
        return (
          <motion.div
            className={cn('bg-current rounded-full', getSizeStyles())}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )
      case 'wave':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-current rounded-full"
                animate={{
                  height: ['4px', '20px', '4px']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )
      default:
        return (
          <motion.div
            className={cn('border-2 border-current border-t-transparent rounded-full', getSizeStyles())}
            variants={premiumLoadingVariants}
            animate="animate"
          />
        )
    }
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {renderVariant()}
    </div>
  )
}

// Premium Stagger Container
interface PremiumStaggerContainerProps {
  children: React.ReactNode
  className?: string
}

export function PremiumStaggerContainer({ children, className = '' }: PremiumStaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={premiumStaggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

// Premium Stagger Item
interface PremiumStaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function PremiumStaggerItem({ children, className = '' }: PremiumStaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={premiumStaggerItem}
    >
      {children}
    </motion.div>
  )
}

// Premium Modal Component
interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function PremiumModal({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  size = 'md'
}: PremiumModalProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'max-w-md'
      case 'md': return 'max-w-lg'
      case 'lg': return 'max-w-2xl'
      case 'xl': return 'max-w-4xl'
      case 'full': return 'max-w-full mx-4'
      default: return 'max-w-lg'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              'bg-white rounded-2xl shadow-2xl w-full overflow-hidden',
              getSizeStyles(),
              className
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              </div>
            )}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Premium Tooltip Component
interface PremiumTooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function PremiumTooltip({
  children,
  content,
  position = 'top',
  className = ''
}: PremiumTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionStyles = () => {
    switch (position) {
      case 'top': return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
      case 'bottom': return 'top-full mt-2 left-1/2 transform -translate-x-1/2'
      case 'left': return 'right-full mr-2 top-1/2 transform -translate-y-1/2'
      case 'right': return 'left-full ml-2 top-1/2 transform -translate-y-1/2'
      default: return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
    }
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap',
              getPositionStyles(),
              className
            )}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            <div className="absolute w-0 h-0 border-4 border-transparent border-t-gray-900 top-full left-1/2 transform -translate-x-1/2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
