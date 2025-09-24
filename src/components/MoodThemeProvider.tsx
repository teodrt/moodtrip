'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useMoodTheme, applyMoodTheme } from '@/lib/mood-themes'
import { motion, AnimatePresence } from 'framer-motion'

interface MoodThemeContextType {
  theme: any
  setVacationMonth: (month: number) => void
  setTripType: (type: string) => void
  currentSeason: string
  currentMood: string
  emotions: string[]
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined)

export function MoodThemeProvider({ children }: { children: React.ReactNode }) {
  const {
    theme,
    setVacationMonth,
    setTripType,
    getSeasonalTheme,
    getTripTypeTheme
  } = useMoodTheme()

  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle theme transitions smoothly
  const handleThemeChange = (newMonth: number, newTripType: string) => {
    setIsTransitioning(true)
    setVacationMonth(newMonth)
    setTripType(newTripType)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 800)
  }

  const currentSeason = theme.season.name
  const currentMood = theme.combined.mood
  const emotions = theme.combined.emotions

  return (
    <MoodThemeContext.Provider
      value={{
        theme,
        setVacationMonth: (month: number) => handleThemeChange(month, theme.trip.mood),
        setTripType: (type: string) => handleThemeChange(theme.season.name, type),
        currentSeason,
        currentMood,
        emotions
      }}
    >
      <div className={`min-h-screen transition-all duration-1000 ${theme.combined.background}`}>
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={`${theme.season.name}-${theme.trip.mood}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="min-h-screen"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MoodThemeContext.Provider>
  )
}

export function useMoodThemeContext() {
  const context = useContext(MoodThemeContext)
  if (context === undefined) {
    throw new Error('useMoodThemeContext must be used within a MoodThemeProvider')
  }
  return context
}

// Mood indicator component - Compact version
export function MoodIndicator() {
  const { theme, currentSeason, currentMood, emotions } = useMoodThemeContext()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="cursor-pointer"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 hover:border-white/40 transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.combined.primary}`} />
          <div>
            <p className="text-white/90 text-xs font-medium">{currentSeason}</p>
            <p className="text-white/60 text-xs capitalize">{currentMood}</p>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {emotions.slice(0, 2).map((emotion, index) => (
            <span
              key={index}
              className="text-xs px-1.5 py-0.5 bg-white/10 rounded-full text-white/70"
            >
              {emotion}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Seasonal theme selector component
export function SeasonalThemeSelector() {
  const { theme, setVacationMonth } = useMoodThemeContext()
  const [isOpen, setIsOpen] = useState(false)

  const seasons = [
    { month: 3, name: 'Spring', emoji: '🌸', description: 'Fresh beginnings' },
    { month: 6, name: 'Summer', emoji: '☀️', description: 'Warm adventures' },
    { month: 9, name: 'Autumn', emoji: '🍂', description: 'Cozy moments' },
    { month: 12, name: 'Winter', emoji: '❄️', description: 'Peaceful retreats' }
  ]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/20 hover:border-white/40 transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${theme.combined.primary} flex items-center justify-center`}>
            <span className="text-white text-sm">
              {(() => {
                const seasonName = theme.season.name
                const seasonMap = { 'Spring': 3, 'Summer': 6, 'Autumn': 9, 'Winter': 12 }
                const month = seasonMap[seasonName as keyof typeof seasonMap] || 3
                return seasons.find(s => s.month === month)?.emoji || '🌸'
              })()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-white text-xs font-medium">{theme.season.name}</p>
            <p className="text-white/60 text-xs">{theme.combined.description}</p>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 min-w-64"
          >
            <h3 className="text-white font-medium mb-3">Choose Your Season</h3>
            <div className="space-y-2">
              {seasons.map((season) => (
                <motion.button
                  key={season.month}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setVacationMonth(season.month)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <span className="text-2xl">{season.emoji}</span>
                  <div className="text-left">
                    <p className="text-white font-medium">{season.name}</p>
                    <p className="text-white/70 text-sm">{season.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
