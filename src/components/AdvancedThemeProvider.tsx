'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    accent: string
  }
  gradients: {
    primary: string
    secondary: string
    background: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

const themes: Record<string, Theme> = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      accent: '#f59e0b'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      accent: '#fbbf24'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
      secondary: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)'
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#06b6d4',
      secondary: '#3b82f6',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      border: '#bae6fd',
      accent: '#f59e0b'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      secondary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(6 182 212 / 0.1)',
      md: '0 4px 6px -1px rgb(6 182 212 / 0.2), 0 2px 4px -2px rgb(6 182 212 / 0.2)',
      lg: '0 10px 15px -3px rgb(6 182 212 / 0.2), 0 4px 6px -4px rgb(6 182 212 / 0.2)',
      xl: '0 20px 25px -5px rgb(6 182 212 / 0.2), 0 8px 10px -6px rgb(6 182 212 / 0.2)'
    }
  },
  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      secondary: '#ec4899',
      background: '#fef7ed',
      surface: '#fed7aa',
      text: '#9a3412',
      textSecondary: '#c2410c',
      border: '#fdba74',
      accent: '#fbbf24'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
      secondary: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(249 115 22 / 0.1)',
      md: '0 4px 6px -1px rgb(249 115 22 / 0.2), 0 2px 4px -2px rgb(249 115 22 / 0.2)',
      lg: '0 10px 15px -3px rgb(249 115 22 / 0.2), 0 4px 6px -4px rgb(249 115 22 / 0.2)',
      xl: '0 20px 25px -5px rgb(249 115 22 / 0.2), 0 8px 10px -6px rgb(249 115 22 / 0.2)'
    }
  }
}

interface ThemeContextType {
  currentTheme: string
  theme: Theme
  setTheme: (themeName: string) => void
  availableThemes: string[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function AdvancedThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState('light')
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('moodtrip-theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    const theme = themes[currentTheme]
    const root = document.documentElement
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value)
    })
    
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })

    // Save to localStorage
    localStorage.setItem('moodtrip-theme', currentTheme)
  }, [currentTheme])

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentTheme(themeName)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const value: ThemeContextType = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme,
    availableThemes: Object.keys(themes)
  }

  return (
    <ThemeContext.Provider value={value}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={`theme-${currentTheme}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeContext.Provider>
  )
}

export function useAdvancedTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useAdvancedTheme must be used within an AdvancedThemeProvider')
  }
  return context
}

// Theme selector component
export function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes } = useAdvancedTheme()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme:</span>
      <select
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableThemes.map(themeName => (
          <option key={themeName} value={themeName}>
            {themes[themeName].name}
          </option>
        ))}
      </select>
    </div>
  )
}

// Animated theme transition wrapper
export function ThemeTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
