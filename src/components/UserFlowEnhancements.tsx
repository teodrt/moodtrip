'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Check, 
  X, 
  Info, 
  AlertCircle,
  CheckCircle,
  Star,
  Heart,
  Zap
} from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useHapticFeedback } from './MobileOptimizations'

// User flow step interface
interface UserFlowStep {
  id: string
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

// User flow system hook
export function useUserFlow() {
  const [steps, setSteps] = useState<UserFlowStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const addStep = (step: UserFlowStep) => {
    setSteps(prev => [...prev, step])
    if (!isActive) {
      setIsActive(true)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsActive(false)
      setSteps([])
      setCurrentStep(0)
    }
  }

  const dismissStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setIsActive(false)
      setSteps([])
      setCurrentStep(0)
    }
  }

  const clearAll = () => {
    setIsActive(false)
    setSteps([])
    setCurrentStep(0)
  }

  return {
    steps,
    currentStep,
    isActive,
    addStep,
    nextStep,
    dismissStep,
    clearAll
  }
}

// User flow step component
interface UserFlowStepProps {
  step: UserFlowStep
  onNext: () => void
  onDismiss: () => void
  isLast: boolean
}

export function UserFlowStepComponent({
  step,
  onNext,
  onDismiss,
  isLast
}: UserFlowStepProps) {
  const { triggerHaptic } = useHapticFeedback()

  const getTypeStyles = () => {
    switch (step.type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800'
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  const getIcon = () => {
    switch (step.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <X className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const handleNext = () => {
    triggerHaptic('light')
    onNext()
  }

  const handleDismiss = () => {
    triggerHaptic('light')
    onDismiss()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      <Card className={`p-4 border-l-4 ${getTypeStyles()}`} variant="premium">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
            <p className="text-sm mb-3">{step.description}</p>
            <div className="flex items-center space-x-2">
              {step.action && (
                <Button
                  size="sm"
                  variant="premium"
                  onClick={step.action.onClick}
                  className="text-xs"
                >
                  {step.action.label}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleNext}
                className="text-xs"
              >
                {isLast ? 'Done' : 'Next'}
              </Button>
              {step.dismissible && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// User flow manager component
export function UserFlowManager() {
  const { steps, currentStep, isActive, nextStep, dismissStep } = useUserFlow()

  if (!isActive || steps.length === 0) {
    return null
  }

  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence>
      {isActive && currentStepData && (
        <UserFlowStepComponent
          step={currentStepData}
          onNext={nextStep}
          onDismiss={dismissStep}
          isLast={currentStep === steps.length - 1}
        />
      )}
    </AnimatePresence>
  )
}

// Quick actions component
interface QuickActionsProps {
  onAddIdea?: () => void
  onJoinGroup?: () => void
  onExplore?: () => void
  onProfile?: () => void
}

export function QuickActions({
  onAddIdea,
  onJoinGroup,
  onExplore,
  onProfile
}: QuickActionsProps) {
  const { triggerHaptic } = useHapticFeedback()

  const actions = [
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Add Idea',
      onClick: onAddIdea,
      variant: 'premium' as const
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: 'Join Group',
      onClick: onJoinGroup,
      variant: 'secondary' as const
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Explore',
      onClick: onExplore,
      variant: 'outline' as const
    },
    {
      icon: <Check className="w-5 h-5" />,
      label: 'Profile',
      onClick: onProfile,
      variant: 'ghost' as const
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Button
            variant={action.variant}
            onClick={() => {
              triggerHaptic('light')
              action.onClick?.()
            }}
            className="w-full h-16 flex flex-col items-center justify-center space-y-2"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            {action.icon}
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

// Progress indicator component
interface ProgressIndicatorProps {
  current: number
  total: number
  label?: string
  className?: string
}

export function ProgressIndicator({
  current,
  total,
  label,
  className = ''
}: ProgressIndicatorProps) {
  const percentage = (current / total) * 100

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{current}/{total}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// Contextual help component
interface ContextualHelpProps {
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function ContextualHelp({
  title,
  content,
  position = 'top',
  className = ''
}: ContextualHelpProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionStyles = () => {
    switch (position) {
      case 'top': return 'bottom-full mb-2'
      case 'bottom': return 'top-full mt-2'
      case 'left': return 'right-full mr-2'
      case 'right': return 'left-full ml-2'
      default: return 'bottom-full mb-2'
    }
  }

  return (
    <div className="relative inline-block">
      <button
        className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        ?
      </button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs ${getPositionStyles()} ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-xs text-gray-600">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
