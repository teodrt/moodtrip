'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMoodThemeContext } from './MoodThemeProvider'
import { Calendar, Heart, Zap, Users, Briefcase, Palette } from 'lucide-react'

interface MoodThemeSelectorProps {
  onThemeChange?: (theme: any) => void
  className?: string
}

export function MoodThemeSelector({ onThemeChange, className = '' }: MoodThemeSelectorProps) {
  const { theme, setVacationMonth, setTripType, currentSeason, currentMood } = useMoodThemeContext()
  const [isOpen, setIsOpen] = useState(false)

  const tripTypes = [
    { 
      id: 'family', 
      name: 'Family', 
      icon: <Users className="h-5 w-5" />, 
      description: 'Warm family moments',
      emotions: ['love', 'togetherness', 'memories']
    },
    { 
      id: 'adventure', 
      name: 'Adventure', 
      icon: <Zap className="h-5 w-5" />, 
      description: 'Thrilling experiences',
      emotions: ['excitement', 'challenge', 'freedom']
    },
    { 
      id: 'romantic', 
      name: 'Romantic', 
      icon: <Heart className="h-5 w-5" />, 
      description: 'Intimate moments',
      emotions: ['love', 'passion', 'intimacy']
    },
    { 
      id: 'business', 
      name: 'Business', 
      icon: <Briefcase className="h-5 w-5" />, 
      description: 'Professional success',
      emotions: ['focus', 'success', 'networking']
    },
    { 
      id: 'relaxation', 
      name: 'Relaxation', 
      icon: <Palette className="h-5 w-5" />, 
      description: 'Peaceful retreats',
      emotions: ['peace', 'tranquility', 'renewal']
    }
  ]

  const months = [
    { value: 1, name: 'January', season: 'Winter', emoji: '❄️' },
    { value: 2, name: 'February', season: 'Winter', emoji: '💙' },
    { value: 3, name: 'March', season: 'Spring', emoji: '🌸' },
    { value: 4, name: 'April', season: 'Spring', emoji: '🌱' },
    { value: 5, name: 'May', season: 'Spring', emoji: '🌺' },
    { value: 6, name: 'June', season: 'Summer', emoji: '☀️' },
    { value: 7, name: 'July', season: 'Summer', emoji: '🌞' },
    { value: 8, name: 'August', season: 'Summer', emoji: '🏖️' },
    { value: 9, name: 'September', season: 'Autumn', emoji: '🍂' },
    { value: 10, name: 'October', season: 'Autumn', emoji: '🎃' },
    { value: 11, name: 'November', season: 'Autumn', emoji: '🦃' },
    { value: 12, name: 'December', season: 'Winter', emoji: '🎄' }
  ]

  const handleTripTypeChange = (tripType: string) => {
    setTripType(tripType)
    onThemeChange?.(theme)
  }

  const handleMonthChange = (month: number) => {
    setVacationMonth(month)
    onThemeChange?.(theme)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Theme Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display text-white">Mood & Theme</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-300"
          >
            Customize
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Season */}
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${theme.combined.primary} flex items-center justify-center`}>
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{currentSeason}</p>
                <p className="text-white/70 text-sm">{theme.combined.description}</p>
              </div>
            </div>
          </div>

          {/* Current Trip Type */}
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${theme.combined.secondary} flex items-center justify-center`}>
                {tripTypes.find(t => t.id === theme.trip.mood)?.icon || <Users className="h-4 w-4 text-white" />}
              </div>
              <div>
                <p className="text-white font-medium capitalize">{theme.trip.mood}</p>
                <p className="text-white/70 text-sm">{theme.trip.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Emotions */}
        <div className="mt-4">
          <p className="text-white/80 text-sm mb-2">Current Mood:</p>
          <div className="flex flex-wrap gap-2">
            {theme.combined.emotions.slice(0, 4).map((emotion, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-white/20 rounded-full text-white/90 text-sm"
              >
                {emotion}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Theme Customization Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20"
          >
            <h4 className="text-lg font-display text-white mb-4">Customize Your Experience</h4>
            
            {/* Vacation Month Selector */}
            <div className="mb-6">
              <h5 className="text-white font-medium mb-3">When are you traveling?</h5>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {months.map((month) => (
                  <motion.button
                    key={month.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMonthChange(month.value)}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      theme.season.name.toLowerCase().includes(month.season.toLowerCase())
                        ? 'bg-white/30 border-2 border-white/50'
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{month.emoji}</div>
                      <p className="text-white text-xs font-medium">{month.name.slice(0, 3)}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Trip Type Selector */}
            <div>
              <h5 className="text-white font-medium mb-3">What type of trip?</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tripTypes.map((tripType) => (
                  <motion.button
                    key={tripType.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTripTypeChange(tripType.id)}
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      theme.trip.mood === tripType.id
                        ? 'bg-white/30 border-2 border-white/50'
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${theme.combined.accent} flex items-center justify-center`}>
                        {tripType.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{tripType.name}</p>
                        <p className="text-white/70 text-sm">{tripType.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
