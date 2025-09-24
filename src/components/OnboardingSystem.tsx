'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Skip, 
  Sparkles, 
  Heart, 
  Globe, 
  Users, 
  MapPin, 
  Calendar,
  Star,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useDeviceDetection, useHapticFeedback } from './MobileOptimizations'

// Onboarding step interface
interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  skipable?: boolean
}

// Onboarding system hook
export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  useEffect(() => {
    const hasSeen = localStorage.getItem('onboarding-completed')
    setHasSeenOnboarding(!!hasSeen)
  }, [])

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const completeOnboarding = () => {
    setIsCompleted(true)
    localStorage.setItem('onboarding-completed', 'true')
  }

  const resetOnboarding = () => {
    setCurrentStep(0)
    setIsCompleted(false)
    localStorage.removeItem('onboarding-completed')
  }

  return {
    currentStep,
    isCompleted,
    hasSeenOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    resetOnboarding
  }
}

// Onboarding step component
interface OnboardingStepProps {
  step: OnboardingStep
  isActive: boolean
  isCompleted: boolean
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
  onComplete: () => void
  totalSteps: number
  currentIndex: number
}

export function OnboardingStepComponent({
  step,
  isActive,
  isCompleted,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  totalSteps,
  currentIndex
}: OnboardingStepProps) {
  const { device } = useDeviceDetection()
  const { triggerHaptic } = useHapticFeedback()

  const handleNext = () => {
    triggerHaptic('light')
    if (currentIndex === totalSteps - 1) {
      onComplete()
    } else {
      onNext()
    }
  }

  const handlePrev = () => {
    triggerHaptic('light')
    onPrev()
  }

  const handleSkip = () => {
    triggerHaptic('medium')
    onSkip()
  }

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center justify-center min-h-screen p-6"
        >
          {/* Progress indicator */}
          <div className="w-full max-w-md mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step {currentIndex + 1} of {totalSteps}</span>
              <span className="text-sm text-gray-600">{Math.round(((currentIndex + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step content */}
          <Card className="w-full max-w-md p-8 text-center" variant="premium">
            <motion.div
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {step.icon}
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {step.title}
            </motion.h2>

            <motion.p
              className="text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {step.description}
            </motion.p>

            {/* Step content */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {step.content}
            </motion.div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {currentIndex > 0 && (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              )}

              {step.skipable && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="flex items-center gap-2"
                >
                  <Skip className="w-4 h-4" />
                  Skip
                </Button>
              )}

              <Button
                variant="premium"
                onClick={handleNext}
                className="flex items-center gap-2 flex-1"
              >
                {currentIndex === totalSteps - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Welcome step content
export function WelcomeStepContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </motion.div>
        <span className="text-lg font-semibold text-gray-900">Welcome to MoodTrip!</span>
      </div>
      <p className="text-sm text-gray-500">
        Let's create amazing travel experiences together
      </p>
    </div>
  )
}

// Features step content
export function FeaturesStepContent() {
  const features = [
    { icon: <Heart className="w-5 h-5" />, text: "Share travel ideas" },
    { icon: <Users className="w-5 h-5" />, text: "Collaborate with friends" },
    { icon: <MapPin className="w-5 h-5" />, text: "Discover new places" },
    { icon: <Calendar className="w-5 h-5" />, text: "Plan your trips" }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <div className="text-blue-500">{feature.icon}</div>
          <span className="text-sm font-medium text-gray-700">{feature.text}</span>
        </motion.div>
      ))}
    </div>
  )
}

// Personalization step content
export function PersonalizationStepContent() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const interests = [
    { id: 'adventure', label: 'Adventure', icon: <Target className="w-4 h-4" /> },
    { id: 'culture', label: 'Culture', icon: <Globe className="w-4 h-4" /> },
    { id: 'relaxation', label: 'Relaxation', icon: <Heart className="w-4 h-4" /> },
    { id: 'food', label: 'Food & Dining', icon: <Star className="w-4 h-4" /> },
    { id: 'nature', label: 'Nature', icon: <MapPin className="w-4 h-4" /> },
    { id: 'nightlife', label: 'Nightlife', icon: <Zap className="w-4 h-4" /> }
  ]

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        What kind of travel experiences interest you most?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest) => (
          <motion.button
            key={interest.id}
            className={`
              flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200
              ${selectedInterests.includes(interest.id)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }
            `}
            onClick={() => toggleInterest(interest.id)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={selectedInterests.includes(interest.id) ? 'text-blue-500' : 'text-gray-400'}>
              {interest.icon}
            </div>
            <span className="text-sm font-medium">{interest.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Get started step content
export function GetStartedStepContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <TrendingUp className="w-6 h-6 text-green-500" />
        </motion.div>
        <span className="text-lg font-semibold text-gray-900">You're all set!</span>
      </div>
      <p className="text-sm text-gray-500">
        Start exploring and creating amazing travel experiences
      </p>
    </div>
  )
}

// Main onboarding component
interface OnboardingProps {
  onComplete?: () => void
  onSkip?: () => void
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const {
    currentStep,
    isCompleted,
    hasSeenOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    resetOnboarding
  } = useOnboarding()

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to MoodTrip',
      description: 'Your personal travel companion for discovering and sharing amazing experiences with friends and family.',
      icon: <Sparkles className="w-8 h-8" />,
      content: <WelcomeStepContent />,
      skipable: true
    },
    {
      id: 'features',
      title: 'Discover Amazing Features',
      description: 'Explore what makes MoodTrip special and how it can enhance your travel planning experience.',
      icon: <Heart className="w-8 h-8" />,
      content: <FeaturesStepContent />,
      skipable: true
    },
    {
      id: 'personalization',
      title: 'Personalize Your Experience',
      description: 'Tell us about your travel preferences so we can recommend the best experiences for you.',
      icon: <Target className="w-8 h-8" />,
      content: <PersonalizationStepContent />,
      skipable: true
    },
    {
      id: 'get-started',
      title: 'Ready to Explore',
      description: 'Everything is set up! Start discovering amazing travel ideas and sharing them with your friends.',
      icon: <TrendingUp className="w-8 h-8" />,
      content: <GetStartedStepContent />,
      skipable: false
    }
  ]

  const handleComplete = () => {
    completeOnboarding()
    onComplete?.()
  }

  const handleSkip = () => {
    completeOnboarding()
    onSkip?.()
  }

  if (isCompleted || hasSeenOnboarding) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 z-50">
      <OnboardingStepComponent
        step={steps[currentStep]}
        isActive={true}
        isCompleted={false}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={handleSkip}
        onComplete={handleComplete}
        totalSteps={steps.length}
        currentIndex={currentStep}
      />
    </div>
  )
}

// Onboarding trigger component
interface OnboardingTriggerProps {
  children: React.ReactNode
  onStart?: () => void
}

export function OnboardingTrigger({ children, onStart }: OnboardingTriggerProps) {
  const { hasSeenOnboarding, resetOnboarding } = useOnboarding()

  const handleStart = () => {
    resetOnboarding()
    onStart?.()
  }

  return (
    <div onClick={handleStart}>
      {children}
    </div>
  )
}
