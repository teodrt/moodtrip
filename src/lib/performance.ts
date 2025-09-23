// src/lib/performance.ts

import { useEffect, useRef, useState, useCallback } from 'react'

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for performance optimization
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecuted = useRef<number>(Date.now())

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now()
      setThrottledValue(value)
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now()
        setThrottledValue(value)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [value, delay])

  return throttledValue
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}

// Virtual scrolling hook
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index
  }))

  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}

// Image lazy loading hook
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { ref, hasIntersected } = useIntersectionObserver()

  useEffect(() => {
    if (hasIntersected && src) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoading(false)
      }
      img.onerror = () => {
        setHasError(true)
        setIsLoading(false)
      }
      img.src = src
    }
  }, [hasIntersected, src])

  return { ref, imageSrc, isLoading, hasError }
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderStart = useRef<number>(0)
  const [renderTime, setRenderTime] = useState<number>(0)

  useEffect(() => {
    renderStart.current = performance.now()
    
    return () => {
      const renderEnd = performance.now()
      const duration = renderEnd - renderStart.current
      setRenderTime(duration)
      
      if (duration > 16) { // More than one frame at 60fps
        console.warn(`${componentName} render took ${duration.toFixed(2)}ms`)
      }
    }
  }, [componentName])

  return { renderTime }
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null>(null)

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000)

    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}

// Bundle size analyzer
export function useBundleAnalyzer() {
  const [bundleSize, setBundleSize] = useState<number>(0)

  useEffect(() => {
    // This would typically be done at build time
    // For now, we'll estimate based on loaded resources
    const scripts = document.querySelectorAll('script[src]')
    let totalSize = 0

    scripts.forEach(script => {
      const src = script.getAttribute('src')
      if (src && src.includes('_next/static')) {
        // Estimate size based on script name patterns
        totalSize += 100000 // Rough estimate
      }
    })

    setBundleSize(totalSize)
  }, [])

  return bundleSize
}

// Network performance monitoring
export function useNetworkMonitor() {
  const [connectionInfo, setConnectionInfo] = useState<{
    effectiveType: string
    downlink: number
    rtt: number
  } | null>(null)

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setConnectionInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      })

      const updateConnection = () => {
        setConnectionInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        })
      }

      connection.addEventListener('change', updateConnection)
      return () => connection.removeEventListener('change', updateConnection)
    }
  }, [])

  return connectionInfo
}

// Resource preloading utilities
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export function preloadFont(fontFamily: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const font = new FontFace(fontFamily, `url(${src})`)
    font.load().then(() => {
      document.fonts.add(font)
      resolve()
    }).catch(reject)
  })
}

// Code splitting utilities
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  return React.lazy(importFunc)
}

// Memoization utilities
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Cache management
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

// Global cache instance
export const globalCache = new CacheManager()

// Performance metrics collection
export function collectPerformanceMetrics() {
  const metrics = {
    navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
    paint: performance.getEntriesByType('paint'),
    resource: performance.getEntriesByType('resource'),
    memory: (performance as any).memory,
    connection: (navigator as any).connection
  }

  return metrics
}

// Web Vitals collection
export function collectWebVitals() {
  const vitals = {
    FCP: 0, // First Contentful Paint
    LCP: 0, // Largest Contentful Paint
    FID: 0, // First Input Delay
    CLS: 0, // Cumulative Layout Shift
    TTFB: 0  // Time to First Byte
  }

  // This would typically use web-vitals library
  // For now, we'll provide a basic implementation
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint') {
        if (entry.name === 'first-contentful-paint') {
          vitals.FCP = entry.startTime
        }
      }
    }
  })

  observer.observe({ entryTypes: ['paint'] })

  return vitals
}

// Image optimization utilities
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  // This would integrate with your image optimization service
  // For now, we'll return the original src
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())

  return `${src}?${params.toString()}`
}

// Critical resource hints
export function addResourceHints() {
  const hints = [
    { rel: 'preconnect', href: 'https://images.unsplash.com' },
    { rel: 'dns-prefetch', href: 'https://api.unsplash.com' },
    { rel: 'preload', href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' }
  ]

  hints.forEach(hint => {
    const link = document.createElement('link')
    Object.entries(hint).forEach(([key, value]) => {
      link.setAttribute(key, value)
    })
    document.head.appendChild(link)
  })
}