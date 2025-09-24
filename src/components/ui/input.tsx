import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

function Input({ 
  className, 
  type, 
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  ...props 
}: React.ComponentProps<"input"> & {
  variant?: 'default' | 'glass' | 'premium' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20'
      case 'premium':
        return 'bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-xl border border-white/30 shadow-lg focus:border-blue-500 focus:ring-blue-500/20'
      case 'floating':
        return 'bg-white/95 backdrop-blur-xl border border-gray-200 shadow-lg focus:border-blue-500 focus:ring-blue-500/20 focus:shadow-xl'
      default:
        return 'bg-transparent border-input focus:border-ring focus:ring-ring/50'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'h-8 px-3 text-sm'
      case 'md': return 'h-10 px-4'
      case 'lg': return 'h-12 px-4 text-lg'
      default: return 'h-10 px-4'
    }
  }

  return (
    <div className="relative">
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <motion.input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-xl text-base shadow-xs transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          getVariantStyles(),
          getSizeStyles(),
          icon && iconPosition === 'left' ? 'pl-10' : '',
          icon && iconPosition === 'right' ? 'pr-10' : '',
          className
        )}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  )
}

export { Input }
