/**
 * Performance Monitoring Utilities
 * Track Core Web Vitals and custom metrics
 */

interface PerformanceMetric {
  name: string
  value: number
  delta: number
  id: string
  navigationType: string
}

interface CustomMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: CustomMetric[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeWebVitals()
    this.initializeCustomMetrics()
  }

  private initializeWebVitals() {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      this.observeMetric('largest-contentful-paint', (entry) => {
        this.recordMetric('LCP', entry.startTime, {
          element: entry.element?.tagName,
          url: entry.url
        })
      })

      // First Input Delay (FID)
      this.observeMetric('first-input', (entry) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime, {
          eventType: entry.name,
          target: entry.target?.tagName
        })
      })

      // Cumulative Layout Shift (CLS)
      this.observeMetric('layout-shift', (entry) => {
        if (!(entry as any).hadRecentInput) {
          this.recordMetric('CLS', (entry as any).value, {
            sources: (entry as any).sources?.length || 0
          })
        }
      })
    }
  }

  private observeMetric(type: string, callback: (entry: PerformanceEntry) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry)
        }
      })
      observer.observe({ type, buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error)
    }
  }

  private initializeCustomMetrics() {
    // Track page load time
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now()
        this.recordMetric('PageLoad', loadTime)
      })

      // Track route changes (for SPA)
      let navigationStart = performance.now()
      window.addEventListener('beforeunload', () => {
        const navigationTime = performance.now() - navigationStart
        this.recordMetric('NavigationTime', navigationTime)
      })

      // Track memory usage (if available)
      if ('memory' in performance) {
        setInterval(() => {
          const memory = (performance as any).memory
          this.recordMetric('MemoryUsage', memory.usedJSHeapSize, {
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          })
        }, 30000) // Every 30 seconds
      }
    }
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: CustomMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    }

    this.metrics.push(metric)

    // Send to analytics (PostHog, Google Analytics, etc.)
    this.sendToAnalytics(metric)

    // Keep only last 100 metrics in memory
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  private sendToAnalytics(metric: CustomMetric) {
    // Send to PostHog
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture('performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        timestamp: metric.timestamp,
        ...metric.metadata
      })
    }

    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        ...metric.metadata
      })
    }
  }

  // Track custom business metrics
  trackIdeaCreationTime(timeMs: number) {
    this.recordMetric('IdeaCreationTime', timeMs)
  }

  trackImageGenerationTime(timeMs: number, imageCount: number) {
    this.recordMetric('ImageGenerationTime', timeMs, { imageCount })
  }

  trackDatabaseQueryTime(queryName: string, timeMs: number) {
    this.recordMetric('DatabaseQueryTime', timeMs, { queryName })
  }

  trackAPIResponseTime(endpoint: string, timeMs: number, statusCode: number) {
    this.recordMetric('APIResponseTime', timeMs, { endpoint, statusCode })
  }

  trackUserInteraction(action: string, timeMs: number, element?: string) {
    this.recordMetric('UserInteraction', timeMs, { action, element })
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      averageLoadTime: this.getAverageMetric('PageLoad'),
      averageLCP: this.getAverageMetric('LCP'),
      averageFID: this.getAverageMetric('FID'),
      averageCLS: this.getAverageMetric('CLS'),
      memoryUsage: this.getLatestMetric('MemoryUsage')?.value,
      recentMetrics: this.metrics.slice(-10)
    }

    return summary
  }

  private getAverageMetric(name: string): number {
    const metrics = this.metrics.filter(m => m.name === name)
    if (metrics.length === 0) return 0
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length
  }

  private getLatestMetric(name: string): CustomMetric | undefined {
    return this.metrics
      .filter(m => m.name === name)
      .sort((a, b) => b.timestamp - a.timestamp)[0]
  }

  // Cleanup
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for performance tracking
export function usePerformanceTracking() {
  const trackTiming = (name: string, fn: () => void | Promise<void>) => {
    const start = performance.now()
    
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now()
        performanceMonitor.recordMetric(name, end - start)
      })
    } else {
      const end = performance.now()
      performanceMonitor.recordMetric(name, end - start)
      return result
    }
  }

  const trackAsyncTiming = async (name: string, fn: () => Promise<any>) => {
    const start = performance.now()
    try {
      const result = await fn()
      return result
    } finally {
      const end = performance.now()
      performanceMonitor.recordMetric(name, end - start)
    }
  }

  return {
    trackTiming,
    trackAsyncTiming,
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getSummary: performanceMonitor.getPerformanceSummary.bind(performanceMonitor)
  }
}
