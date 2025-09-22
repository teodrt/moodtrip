'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdvancedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
  retryCount?: number
  maxRetries?: number
}

export function AdvancedImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes = '100vw',
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc = 'https://picsum.photos/800/600?random=fallback',
  retryCount = 0,
  maxRetries = 3,
  ...props
}: AdvancedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [retryAttempts, setRetryAttempts] = useState(retryCount)
  const imgRef = useRef<HTMLImageElement>(null)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    if (retryAttempts < maxRetries) {
      // Retry with exponential backoff
      const delay = Math.pow(2, retryAttempts) * 1000
      setTimeout(() => {
        setRetryAttempts(prev => prev + 1)
        setCurrentSrc(`${src}?retry=${retryAttempts + 1}&t=${Date.now()}`)
      }, delay)
    } else {
      // Use fallback image
      setCurrentSrc(fallbackSrc)
      setHasError(true)
      setIsLoading(false)
      onError?.()
    }
  }, [src, fallbackSrc, retryAttempts, maxRetries, onError])

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src)
    setIsLoading(true)
    setHasError(false)
    setRetryAttempts(0)
  }, [src])

  const imageProps = {
    src: currentSrc,
    alt,
    fill,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    className: cn(
      'transition-opacity duration-300',
      isLoading ? 'opacity-0' : 'opacity-100',
      className
    ),
    priority,
    quality,
    sizes,
    placeholder,
    blurDataURL,
    onLoad: handleLoad,
    onError: handleError,
    ...props,
  }

  return (
    <div className="relative overflow-hidden">
      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10"
          >
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-sm text-gray-500">Loading image...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10"
          >
            <div className="flex flex-col items-center space-y-2 text-center p-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span className="text-sm text-gray-500">Failed to load image</span>
              <button
                onClick={() => {
                  setCurrentSrc(src)
                  setIsLoading(true)
                  setHasError(false)
                  setRetryAttempts(0)
                }}
                className="flex items-center space-x-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <Image ref={imgRef} {...imageProps} />
    </div>
  )
}

// Preload utility for critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    img.src = src
  })
}

// Lazy loading hook
export const useLazyImage = (src: string, threshold = 0.1) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  useEffect(() => {
    if (isInView && !isLoaded) {
      preloadImage(src)
        .then(() => setIsLoaded(true))
        .catch(console.error)
    }
  }, [isInView, src, isLoaded])

  return { imgRef, isLoaded, isInView }
}
