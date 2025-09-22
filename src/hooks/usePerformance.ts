'use client'

import { useEffect, useState, useCallback } from 'react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
  loadTime: number | null
  domContentLoaded: number | null
}

interface PerformanceEntry {
  name: string
  value: number
  delta: number
  id: string
  navigationType: string
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null,
    domContentLoaded: null,
  })

  const [isSupported, setIsSupported] = useState(false)

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return
    }

    setIsSupported(true)

    // Basic timing metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')

    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : null
    const domContentLoaded = navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : null
    const ttfb = navigation ? navigation.responseStart - navigation.requestStart : null

    setMetrics(prev => ({
      ...prev,
      fcp,
      loadTime,
      domContentLoaded,
      ttfb,
    }))

    // Web Vitals (if available)
    if ('web-vitals' in window) {
      // This would require the web-vitals library
      // For now, we'll use basic performance API
    }

    // LCP (Largest Contentful Paint) - basic implementation
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          setMetrics(prev => ({
            ...prev,
            lcp: lastEntry.startTime,
          }))
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        console.warn('LCP observer not supported:', error)
      }

      // CLS (Cumulative Layout Shift) - basic implementation
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          setMetrics(prev => ({
            ...prev,
            cls: clsValue,
          }))
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('CLS observer not supported:', error)
      }
    }
  }, [])

  const logMetrics = useCallback(() => {
    console.group('🚀 Performance Metrics')
    console.log('FCP (First Contentful Paint):', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A')
    console.log('LCP (Largest Contentful Paint):', metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A')
    console.log('TTFB (Time to First Byte):', metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A')
    console.log('Load Time:', metrics.loadTime ? `${metrics.loadTime.toFixed(2)}ms` : 'N/A')
    console.log('DOM Content Loaded:', metrics.domContentLoaded ? `${metrics.domContentLoaded.toFixed(2)}ms` : 'N/A')
    console.log('CLS (Cumulative Layout Shift):', metrics.cls ? metrics.cls.toFixed(4) : 'N/A')
    console.groupEnd()
  }, [metrics])

  const getPerformanceScore = useCallback(() => {
    if (!isSupported) return null

    let score = 100
    const issues: string[] = []

    // FCP scoring (good: <1.8s, needs improvement: 1.8-3.0s, poor: >3.0s)
    if (metrics.fcp) {
      if (metrics.fcp > 3000) {
        score -= 30
        issues.push('FCP is very slow')
      } else if (metrics.fcp > 1800) {
        score -= 15
        issues.push('FCP could be improved')
      }
    }

    // LCP scoring (good: <2.5s, needs improvement: 2.5-4.0s, poor: >4.0s)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) {
        score -= 30
        issues.push('LCP is very slow')
      } else if (metrics.lcp > 2500) {
        score -= 15
        issues.push('LCP could be improved')
      }
    }

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (metrics.cls !== null) {
      if (metrics.cls > 0.25) {
        score -= 20
        issues.push('CLS is poor')
      } else if (metrics.cls > 0.1) {
        score -= 10
        issues.push('CLS could be improved')
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
    }
  }, [metrics, isSupported])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
    }
  }, [measurePerformance])

  return {
    metrics,
    isSupported,
    logMetrics,
    getPerformanceScore,
    measurePerformance,
  }
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const [renderTime, setRenderTime] = useState<number | null>(null)
  const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      const duration = end - start
      setRenderTime(duration)
      setRenderCount(prev => prev + 1)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎨 ${componentName} render time: ${duration.toFixed(2)}ms`)
      }
    }
  }, [componentName])

  return { renderTime, renderCount }
}

// Hook for measuring API call performance
export function useAPIPerformance() {
  const [apiMetrics, setApiMetrics] = useState<Record<string, number[]>>({})

  const measureAPICall = useCallback((endpoint: string, startTime: number) => {
    const duration = performance.now() - startTime
    
    setApiMetrics(prev => ({
      ...prev,
      [endpoint]: [...(prev[endpoint] || []), duration].slice(-10), // Keep last 10 measurements
    }))

    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API ${endpoint}: ${duration.toFixed(2)}ms`)
    }
  }, [])

  const getAPIAverage = useCallback((endpoint: string) => {
    const times = apiMetrics[endpoint]
    if (!times || times.length === 0) return null
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }, [apiMetrics])

  return {
    measureAPICall,
    getAPIAverage,
    apiMetrics,
  }
}
