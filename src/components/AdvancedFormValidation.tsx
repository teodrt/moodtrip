'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
  message?: string
}

export interface FieldValidation {
  isValid: boolean
  message?: string
  isTouched: boolean
  isDirty: boolean
}

export interface FormValidation {
  [key: string]: FieldValidation
}

interface ValidationConfig {
  [fieldName: string]: ValidationRule
}

export function useFormValidation(config: ValidationConfig) {
  const [validation, setValidation] = useState<FormValidation>({})
  const [values, setValues] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [dirty, setDirty] = useState<Set<string>>(new Set())

  const validateField = useCallback((fieldName: string, value: string): FieldValidation => {
    const rule = config[fieldName]
    if (!rule) return { isValid: true, isTouched: touched.has(fieldName), isDirty: dirty.has(fieldName) }

    let message: string | null = null

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      message = rule.message || `${fieldName} is required`
    }
    // Min length validation
    else if (rule.minLength && value.length < rule.minLength) {
      message = rule.message || `${fieldName} must be at least ${rule.minLength} characters`
    }
    // Max length validation
    else if (rule.maxLength && value.length > rule.maxLength) {
      message = rule.message || `${fieldName} must be no more than ${rule.maxLength} characters`
    }
    // Pattern validation
    else if (rule.pattern && !rule.pattern.test(value)) {
      message = rule.message || `${fieldName} format is invalid`
    }
    // Custom validation
    else if (rule.custom) {
      message = rule.custom(value)
    }

    return {
      isValid: !message,
      message,
      isTouched: touched.has(fieldName),
      isDirty: dirty.has(fieldName)
    }
  }, [config, touched, dirty])

  const validateAll = useCallback(() => {
    const newValidation: FormValidation = {}
    Object.keys(config).forEach(fieldName => {
      newValidation[fieldName] = validateField(fieldName, values[fieldName] || '')
    })
    setValidation(newValidation)
    return Object.values(newValidation).every(field => field.isValid)
  }, [config, values, validateField])

  const setValue = useCallback((fieldName: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    setDirty(prev => new Set([...prev, fieldName]))
    
    // Real-time validation
    const fieldValidation = validateField(fieldName, value)
    setValidation(prev => ({ ...prev, [fieldName]: fieldValidation }))
  }, [validateField])

  const setTouchedField = useCallback((fieldName: string) => {
    setTouched(prev => new Set([...prev, fieldName]))
    
    // Validate on blur
    const fieldValidation = validateField(fieldName, values[fieldName] || '')
    setValidation(prev => ({ ...prev, [fieldName]: fieldValidation }))
  }, [values, validateField])

  const reset = useCallback(() => {
    setValues({})
    setTouched(new Set())
    setDirty(new Set())
    setValidation({})
  }, [])

  const isFormValid = Object.values(validation).every(field => field.isValid)
  const hasErrors = Object.values(validation).some(field => !field.isValid && field.isTouched)

  return {
    values,
    validation,
    setValue,
    setTouchedField,
    validateAll,
    reset,
    isFormValid,
    hasErrors
  }
}

interface ValidatedInputProps {
  name: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  label?: string
  validation: FieldValidation
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  className?: string
  showPasswordToggle?: boolean
}

export function ValidatedInput({
  name,
  type = 'text',
  placeholder,
  label,
  validation,
  value,
  onChange,
  onBlur,
  className,
  showPasswordToggle = false
}: ValidatedInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type

  const getInputStyles = () => {
    if (validation.isTouched) {
      if (validation.isValid) {
        return 'border-green-300 focus:border-green-500 focus:ring-green-500'
      } else {
        return 'border-red-300 focus:border-red-500 focus:ring-red-500'
      }
    }
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }

  const getIcon = () => {
    if (!validation.isTouched) return null
    
    if (validation.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            onBlur()
            setIsFocused(false)
          }}
          onFocus={() => setIsFocused(true)}
          className={cn(
            'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors',
            getInputStyles()
          )}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
          {!showPasswordToggle && getIcon()}
        </div>
      </div>

      <AnimatePresence>
        {validation.isTouched && validation.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{validation.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ValidatedTextareaProps {
  name: string
  placeholder?: string
  label?: string
  validation: FieldValidation
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  className?: string
  rows?: number
}

export function ValidatedTextarea({
  name,
  placeholder,
  label,
  validation,
  value,
  onChange,
  onBlur,
  className,
  rows = 3
}: ValidatedTextareaProps) {
  const getTextareaStyles = () => {
    if (validation.isTouched) {
      if (validation.isValid) {
        return 'border-green-300 focus:border-green-500 focus:ring-green-500'
      } else {
        return 'border-red-300 focus:border-red-500 focus:ring-red-500'
      }
    }
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        className={cn(
          'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors resize-vertical',
          getTextareaStyles()
        )}
      />

      <AnimatePresence>
        {validation.isTouched && validation.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-1 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{validation.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://'
  }
}
