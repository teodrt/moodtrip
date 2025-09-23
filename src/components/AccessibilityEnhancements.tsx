'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Keyboard, 
  MousePointer,
  Focus,
  SkipForward,
  SkipBack,
  Play,
  Pause,
  RotateCcw,
  Settings,
  HelpCircle,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

// Screen reader announcements
export function useScreenReaderAnnouncements() {
  const [announcements, setAnnouncements] = useState<string[]>([])
  const announcementRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, `${priority}:${message}`])
    
    // Clear announcement after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 1000)
  }, [])

  return {
    announce,
    announcements,
    announcementRef
  }
}

// Focus management hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)
  const [focusHistory, setFocusHistory] = useState<HTMLElement[]>([])
  const focusableElements = useRef<HTMLElement[]>([])

  const updateFocusableElements = useCallback(() => {
    const elements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    focusableElements.current = Array.from(elements)
  }, [])

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableInContainer = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    if (focusableInContainer.length === 0) return

    const firstElement = focusableInContainer[0]
    const lastElement = focusableInContainer[focusableInContainer.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const moveFocus = useCallback((direction: 'next' | 'previous' | 'first' | 'last') => {
    updateFocusableElements()
    const elements = focusableElements.current
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement)

    let newIndex = currentIndex

    switch (direction) {
      case 'next':
        newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
        break
      case 'previous':
        newIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
        break
      case 'first':
        newIndex = 0
        break
      case 'last':
        newIndex = elements.length - 1
        break
    }

    if (elements[newIndex]) {
      elements[newIndex].focus()
      setFocusedElement(elements[newIndex])
      setFocusHistory(prev => [...prev, elements[newIndex]])
    }
  }, [updateFocusableElements])

  const skipToContent = useCallback(() => {
    const mainContent = document.querySelector('main, [role="main"]') as HTMLElement
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    updateFocusableElements()
    const handleFocus = (e: FocusEvent) => {
      setFocusedElement(e.target as HTMLElement)
    }

    document.addEventListener('focusin', handleFocus)
    return () => document.removeEventListener('focusin', handleFocus)
  }, [updateFocusableElements])

  return {
    focusedElement,
    focusHistory,
    trapFocus,
    moveFocus,
    skipToContent,
    updateFocusableElements
  }
}

// Keyboard navigation component
interface KeyboardNavigationProps {
  children: React.ReactNode
  className?: string
  onKeyDown?: (e: KeyboardEvent) => void
}

export function KeyboardNavigation({ children, className = '', onKeyDown }: KeyboardNavigationProps) {
  const { moveFocus, skipToContent } = useFocusManagement()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global keyboard shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            skipToContent()
            break
          case '2':
            e.preventDefault()
            moveFocus('first')
            break
          case '3':
            e.preventDefault()
            moveFocus('last')
            break
          case 'ArrowDown':
            e.preventDefault()
            moveFocus('next')
            break
          case 'ArrowUp':
            e.preventDefault()
            moveFocus('previous')
            break
        }
      }

      // Call custom handler
      onKeyDown?.(e)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [moveFocus, skipToContent, onKeyDown])

  return (
    <div className={className} role="navigation" aria-label="Keyboard navigation">
      {children}
    </div>
  )
}

// High contrast mode toggle
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('high-contrast-mode')
    if (saved) {
      setIsHighContrast(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', isHighContrast)
    localStorage.setItem('high-contrast-mode', JSON.stringify(isHighContrast))
  }, [isHighContrast])

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast(prev => !prev)
  }, [])

  return { isHighContrast, toggleHighContrast }
}

// Reduced motion preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Color blind friendly palette
export function useColorBlindFriendly() {
  const [isColorBlindFriendly, setIsColorBlindFriendly] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('color-blind-friendly')
    if (saved) {
      setIsColorBlindFriendly(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('color-blind-friendly', isColorBlindFriendly)
    localStorage.setItem('color-blind-friendly', JSON.stringify(isColorBlindFriendly))
  }, [isColorBlindFriendly])

  const toggleColorBlindFriendly = useCallback(() => {
    setIsColorBlindFriendly(prev => !prev)
  }, [])

  return { isColorBlindFriendly, toggleColorBlindFriendly }
}

// Accessibility settings panel
interface AccessibilitySettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilitySettings({ isOpen, onClose }: AccessibilitySettingsProps) {
  const { isHighContrast, toggleHighContrast } = useHighContrastMode()
  const { isColorBlindFriendly, toggleColorBlindFriendly } = useColorBlindFriendly()
  const prefersReducedMotion = useReducedMotion()
  const { announce } = useScreenReaderAnnouncements()

  const handleToggle = (setting: string, toggleFn: () => void) => {
    toggleFn()
    announce(`${setting} ${setting.includes('enabled') ? 'disabled' : 'enabled'}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="accessibility-settings-title"
            aria-describedby="accessibility-settings-description"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="accessibility-settings-title" className="text-xl font-semibold">
                Accessibility Settings
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close accessibility settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <p id="accessibility-settings-description" className="text-gray-600 mb-6">
              Customize your experience to make the app more accessible.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">High Contrast Mode</h3>
                    <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('High contrast mode', toggleHighContrast)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isHighContrast ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-pressed={isHighContrast}
                  aria-label="Toggle high contrast mode"
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: isHighContrast ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Focus className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">Color Blind Friendly</h3>
                    <p className="text-sm text-gray-500">Use patterns and shapes instead of colors</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('Color blind friendly mode', toggleColorBlindFriendly)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isColorBlindFriendly ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-pressed={isColorBlindFriendly}
                  aria-label="Toggle color blind friendly mode"
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: isColorBlindFriendly ? 24 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">Reduced Motion</h3>
                    <p className="text-sm text-gray-500">
                      {prefersReducedMotion ? 'Enabled' : 'Disabled'} (system preference)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <CheckCircle className={`w-4 h-4 ${prefersReducedMotion ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-3">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Skip to main content</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + 1</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Focus first element</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + 2</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Focus last element</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + 3</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Navigate down</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + ↓</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Navigate up</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + ↑</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Skip links component
export function SkipLinks() {
  const { skipToContent } = useFocusManagement()

  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault()
          skipToContent()
        }}
        className="absolute top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="absolute top-4 left-32 z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to navigation
      </a>
    </div>
  )
}

// Focus indicator component
export function FocusIndicator() {
  const { focusedElement } = useFocusManagement()
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (focusedElement) {
      const rect = focusedElement.getBoundingClientRect()
      setIndicatorStyle({
        position: 'fixed',
        top: rect.top - 2,
        left: rect.left - 2,
        width: rect.width + 4,
        height: rect.height + 4,
        border: '2px solid #3b82f6',
        borderRadius: '4px',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'all 0.1s ease'
      })
    }
  }, [focusedElement])

  return focusedElement ? (
    <motion.div
      style={indicatorStyle}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    />
  ) : null
}

// ARIA live region for announcements
export function AriaLiveRegion({ announcements, announcementRef }: {
  announcements: string[]
  announcementRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcements.map((announcement, index) => (
        <div key={index}>{announcement}</div>
      ))}
    </div>
  )
}

// Accessibility testing utilities
export function useAccessibilityTesting() {
  const [issues, setIssues] = useState<Array<{
    type: 'error' | 'warning' | 'info'
    message: string
    element?: HTMLElement
  }>>([])

  const runAccessibilityCheck = useCallback(() => {
    const newIssues: Array<{
      type: 'error' | 'warning' | 'info'
      message: string
      element?: HTMLElement
    }> = []

    // Check for missing alt text
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        newIssues.push({
          type: 'error',
          message: 'Image missing alt text',
          element: img as HTMLElement
        })
      }
    })

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      const id = input.getAttribute('id')
      const ariaLabel = input.getAttribute('aria-label')
      const ariaLabelledBy = input.getAttribute('aria-labelledby')
      
      if (!id && !ariaLabel && !ariaLabelledBy) {
        const label = document.querySelector(`label[for="${id}"]`)
        if (!label) {
          newIssues.push({
            type: 'error',
            message: 'Form control missing label',
            element: input as HTMLElement
          })
        }
      }
    })

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > lastLevel + 1) {
        newIssues.push({
          type: 'warning',
          message: `Heading level skipped from h${lastLevel} to h${level}`,
          element: heading as HTMLElement
        })
      }
      lastLevel = level
    })

    setIssues(newIssues)
  }, [])

  return { issues, runAccessibilityCheck }
}
