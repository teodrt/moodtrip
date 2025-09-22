'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ColorPaletteProps {
  colors: string[]
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const handleColorClick = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedColor(color)
      setTimeout(() => setCopiedColor(null), 2000)
    } catch (error) {
      console.error('Failed to copy color:', error)
    }
  }

  if (!colors || colors.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Color Palette</h2>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 bg-gray-100"
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">No color palette available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Color Palette</h2>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <motion.div
            key={color}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer"
            onClick={() => handleColorClick(color)}
          >
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ backgroundColor: color }}
              title={color}
            />
            
            {/* Copy feedback */}
            {copiedColor === color && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded"
              >
                Copied!
              </motion.div>
            )}
            
            {/* Hover tooltip */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {color}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Click any color to copy its hex code
      </p>
    </div>
  )
}
