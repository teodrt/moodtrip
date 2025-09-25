'use client'

import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useDarkMode } from '@/lib/dark-mode'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'

interface DarkModeToggleProps {
  className?: string
  variant?: 'button' | 'icon' | 'compact'
}

export function DarkModeToggle({ className, variant = 'button' }: DarkModeToggleProps) {
  const { isDark, toggleDarkMode, setDarkMode } = useDarkMode()

  const handleSystemMode = () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(systemPrefersDark)
  }

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDarkMode}
        className={cn(
          "p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300",
          "dark:bg-gray-800/50 dark:border-gray-700 dark:hover:border-gray-600",
          className
        )}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-blue-400" />
          )}
        </motion.div>
      </motion.button>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300",
            "dark:bg-gray-800/50 dark:border-gray-700 dark:hover:border-gray-600"
          )}
        >
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4 text-blue-400" />
            )}
          </motion.div>
          <span className="text-sm font-medium text-white dark:text-gray-100">
            {isDark ? 'Light' : 'Dark'}
          </span>
        </motion.button>
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300",
            "dark:bg-gray-800/50 dark:border-gray-700 dark:hover:border-gray-600",
            className
          )}
        >
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-400" />
            )}
          </motion.div>
          <span className="text-sm font-medium text-white dark:text-gray-100">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl"
        side="bottom"
        align="end"
      >
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Theme Settings
          </h3>
          
          <div className="space-y-2">
            <Button
              variant={!isDark ? 'default' : 'outline'}
              onClick={() => setDarkMode(false)}
              className="w-full justify-start gap-3 h-12"
            >
              <Sun className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Light Mode</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Clean and bright</div>
              </div>
            </Button>
            
            <Button
              variant={isDark ? 'default' : 'outline'}
              onClick={() => setDarkMode(true)}
              className="w-full justify-start gap-3 h-12"
            >
              <Moon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Easy on the eyes</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSystemMode}
              className="w-full justify-start gap-3 h-12"
            >
              <Monitor className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">System</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Follow system preference</div>
              </div>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
