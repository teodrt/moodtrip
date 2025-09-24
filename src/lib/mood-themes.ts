'use client'

import { useState, useEffect } from 'react'

// Seasonal color palettes based on vacation timing
export const seasonalPalettes = {
  spring: {
    name: 'Spring Awakening',
    primary: 'from-emerald-400 via-green-300 to-teal-400',
    secondary: 'from-pink-300 via-rose-200 to-orange-300',
    accent: 'from-yellow-300 via-amber-200 to-lime-300',
    mood: 'vibrant',
    emotions: ['renewal', 'growth', 'adventure', 'freshness'],
    background: 'bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50',
    text: 'text-emerald-900',
    description: 'Fresh, vibrant, and full of new beginnings'
  },
  summer: {
    name: 'Summer Bliss',
    primary: 'from-yellow-400 via-orange-300 to-red-400',
    secondary: 'from-blue-300 via-cyan-200 to-teal-300',
    accent: 'from-pink-400 via-rose-300 to-purple-400',
    mood: 'energetic',
    emotions: ['joy', 'freedom', 'adventure', 'warmth'],
    background: 'bg-gradient-to-br from-yellow-50 via-orange-100 to-red-50',
    text: 'text-orange-900',
    description: 'Warm, energetic, and full of sunshine'
  },
  autumn: {
    name: 'Autumn Cozy',
    primary: 'from-amber-500 via-orange-400 to-red-500',
    secondary: 'from-yellow-600 via-amber-500 to-orange-600',
    accent: 'from-red-400 via-rose-300 to-purple-400',
    mood: 'cozy',
    emotions: ['comfort', 'warmth', 'nostalgia', 'intimacy'],
    background: 'bg-gradient-to-br from-amber-50 via-orange-100 to-red-50',
    text: 'text-amber-900',
    description: 'Warm, cozy, and perfect for intimate gatherings'
  },
  winter: {
    name: 'Winter Wonder',
    primary: 'from-blue-400 via-indigo-300 to-purple-400',
    secondary: 'from-cyan-300 via-blue-200 to-indigo-300',
    accent: 'from-slate-400 via-gray-300 to-blue-400',
    mood: 'serene',
    emotions: ['peace', 'tranquility', 'magic', 'reflection'],
    background: 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50',
    text: 'text-blue-900',
    description: 'Cool, serene, and perfect for peaceful retreats'
  }
}

// Time-based gradients for dynamic backgrounds
export const timeBasedGradients = {
  sunrise: {
    name: 'Sunrise',
    gradient: 'from-orange-200 via-yellow-100 to-pink-200',
    mood: 'hopeful',
    time: '05:00-08:00'
  },
  morning: {
    name: 'Morning Light',
    gradient: 'from-yellow-100 via-amber-50 to-orange-100',
    mood: 'energetic',
    time: '08:00-12:00'
  },
  afternoon: {
    name: 'Afternoon Glow',
    gradient: 'from-blue-100 via-cyan-50 to-teal-100',
    mood: 'productive',
    time: '12:00-17:00'
  },
  sunset: {
    name: 'Sunset',
    gradient: 'from-orange-300 via-pink-200 to-purple-300',
    mood: 'romantic',
    time: '17:00-20:00'
  },
  evening: {
    name: 'Evening',
    gradient: 'from-purple-200 via-indigo-100 to-blue-200',
    mood: 'relaxed',
    time: '20:00-23:00'
  },
  night: {
    name: 'Night',
    gradient: 'from-slate-800 via-gray-700 to-indigo-800',
    mood: 'peaceful',
    time: '23:00-05:00'
  }
}

// Trip type emotional detection
export const tripTypeEmotions = {
  family: {
    mood: 'warm',
    colors: 'from-rose-400 via-pink-300 to-orange-400',
    emotions: ['love', 'togetherness', 'memories', 'comfort'],
    description: 'Warm and inviting for family moments'
  },
  adventure: {
    mood: 'energetic',
    colors: 'from-emerald-400 via-green-300 to-teal-400',
    emotions: ['excitement', 'challenge', 'freedom', 'discovery'],
    description: 'Bold and adventurous for thrilling experiences'
  },
  romantic: {
    mood: 'intimate',
    colors: 'from-pink-400 via-rose-300 to-purple-400',
    emotions: ['love', 'passion', 'intimacy', 'romance'],
    description: 'Soft and romantic for intimate moments'
  },
  business: {
    mood: 'professional',
    colors: 'from-blue-400 via-indigo-300 to-slate-400',
    emotions: ['focus', 'success', 'networking', 'growth'],
    description: 'Clean and professional for business success'
  },
  relaxation: {
    mood: 'calm',
    colors: 'from-teal-400 via-cyan-300 to-blue-400',
    emotions: ['peace', 'tranquility', 'renewal', 'serenity'],
    description: 'Calm and soothing for relaxation'
  },
  cultural: {
    mood: 'inspiring',
    colors: 'from-purple-400 via-violet-300 to-indigo-400',
    emotions: ['curiosity', 'learning', 'inspiration', 'growth'],
    description: 'Rich and inspiring for cultural exploration'
  }
}

// Hook for dynamic theme management
export function useMoodTheme() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedSeason, setSelectedSeason] = useState<string>('spring')
  const [tripType, setTripType] = useState<string>('family')
  const [vacationMonth, setVacationMonth] = useState<number>(new Date().getMonth() + 1)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Get current time-based theme
  const getTimeBasedTheme = () => {
    const hour = currentTime.getHours()
    
    if (hour >= 5 && hour < 8) return timeBasedGradients.sunrise
    if (hour >= 8 && hour < 12) return timeBasedGradients.morning
    if (hour >= 12 && hour < 17) return timeBasedGradients.afternoon
    if (hour >= 17 && hour < 20) return timeBasedGradients.sunset
    if (hour >= 20 && hour < 23) return timeBasedGradients.evening
    return timeBasedGradients.night
  }

  // Get seasonal theme based on vacation month
  const getSeasonalTheme = (month: number) => {
    if (month >= 3 && month <= 5) return seasonalPalettes.spring
    if (month >= 6 && month <= 8) return seasonalPalettes.summer
    if (month >= 9 && month <= 11) return seasonalPalettes.autumn
    return seasonalPalettes.winter
  }

  // Get trip type emotional theme
  const getTripTypeTheme = (type: string) => {
    return tripTypeEmotions[type as keyof typeof tripTypeEmotions] || tripTypeEmotions.family
  }

  // Combine all themes for the ultimate mood
  const getCombinedTheme = () => {
    const timeTheme = getTimeBasedTheme()
    const seasonalTheme = getSeasonalTheme(vacationMonth)
    const tripTheme = getTripTypeTheme(tripType)

    return {
      time: timeTheme,
      season: seasonalTheme,
      trip: tripTheme,
      combined: {
        background: `bg-gradient-to-br ${seasonalTheme.primary} ${timeTheme.gradient}`,
        primary: seasonalTheme.primary,
        secondary: seasonalTheme.secondary,
        accent: seasonalTheme.accent,
        mood: `${seasonalTheme.mood}-${tripTheme.mood}`,
        emotions: [...seasonalTheme.emotions, ...tripTheme.emotions],
        description: `${seasonalTheme.description} • ${tripTheme.description}`
      }
    }
  }

  return {
    currentTime,
    selectedSeason,
    setSelectedSeason,
    tripType,
    setTripType,
    vacationMonth,
    setVacationMonth,
    getTimeBasedTheme,
    getSeasonalTheme,
    getTripTypeTheme,
    getCombinedTheme,
    theme: getCombinedTheme()
  }
}

// Utility functions for theme application
export const applyMoodTheme = (theme: any) => {
  return {
    background: theme.combined.background,
    primary: theme.combined.primary,
    secondary: theme.combined.secondary,
    accent: theme.combined.accent,
    mood: theme.combined.mood,
    emotions: theme.combined.emotions,
    description: theme.combined.description
  }
}

// Get season from month
export const getSeasonFromMonth = (month: number) => {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// Get month name
export const getMonthName = (month: number) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month - 1]
}
