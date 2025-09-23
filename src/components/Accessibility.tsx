'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Eye, EyeOff, Keyboard, MousePointer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// Skip to content link
export function SkipToContent() {
  const handleSkip = () => {
    const main = document.querySelector('main')
    if (main) {
      main.focus()
      main.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault()
        handleSkip()
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 0 }}
      whileFocus={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      Skip to main content
    </motion.a>
  )
}

// Focus trap for modals
export function FocusTrap({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  const trapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !trapRef.current) return

    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return <div ref={trapRef}>{children}</div>
}

// Screen reader announcements
export function ScreenReaderAnnouncements() {
  const [announcements, setAnnouncements] = useState<string[]>([])

  const announce = (message: string) => {
    setAnnouncements(prev => [...prev, message])
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 1000)
  }

  useEffect(() => {
    // Global announce function
    ;(window as any).announceToScreenReader = announce
  }, [])

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcements.map((announcement, index) => (
        <div key={index}>{announcement}</div>
      ))}
    </div>
  )
}

// High contrast mode
export function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-high-contrast')
    if (saved) {
      setIsHighContrast(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
    localStorage.setItem('accessibility-high-contrast', JSON.stringify(isHighContrast))
  }, [isHighContrast])

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="high-contrast"
        checked={isHighContrast}
        onCheckedChange={setIsHighContrast}
        aria-label="Toggle high contrast mode"
      />
      <Label htmlFor="high-contrast" className="text-sm">
        High Contrast
      </Label>
    </div>
  )
}

// Reduced motion toggle
export function ReducedMotionToggle() {
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-reduced-motion')
    if (saved) {
      setIsReducedMotion(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (isReducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
    localStorage.setItem('accessibility-reduced-motion', JSON.stringify(isReducedMotion))
  }, [isReducedMotion])

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="reduced-motion"
        checked={isReducedMotion}
        onCheckedChange={setIsReducedMotion}
        aria-label="Toggle reduced motion"
      />
      <Label htmlFor="reduced-motion" className="text-sm">
        Reduce Motion
      </Label>
    </div>
  )
}

// Keyboard navigation indicator
export function KeyboardNavigationIndicator() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true)
        document.body.classList.add('keyboard-user')
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardUser(false)
      document.body.classList.remove('keyboard-user')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return null // This component doesn't render anything visible
}

// Accessible button with proper ARIA attributes
interface AccessibleButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ariaLabel,
  ariaDescribedBy
}: AccessibleButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : 'scale-100'}
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-all duration-150 ease-in-out
        rounded-md font-medium
        ${className}
      `}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-pressed={isPressed}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Accessible form field
interface AccessibleFormFieldProps {
  label: string
  id: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  helpText?: string
  className?: string
}

export function AccessibleFormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helpText,
  className = ''
}: AccessibleFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setHasInteracted(true)
  }

  const showError = hasInteracted && error

  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        htmlFor={id}
        className={`text-sm font-medium ${
          showError ? 'text-red-700' : isFocused ? 'text-blue-700' : 'text-gray-700'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        required={required}
        aria-describedby={`${id}-help ${showError ? `${id}-error` : ''}`}
        aria-invalid={showError}
        className={`
          w-full px-3 py-2 border rounded-md
          ${showError 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : isFocused 
              ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
          transition-colors duration-150
        `}
      />
      
      {helpText && (
        <p id={`${id}-help`} className="text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {showError && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Accessibility settings panel
export function AccessibilitySettings() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40"
        aria-label="Open accessibility settings"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Accessibility
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Accessibility Settings
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close accessibility settings"
                    >
                      ×
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Customize your experience for better accessibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <HighContrastToggle />
                    <ReducedMotionToggle />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Tab - Navigate between elements</div>
                      <div>Enter/Space - Activate buttons</div>
                      <div>Escape - Close modals</div>
                      <div>Arrow keys - Navigate menus</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
