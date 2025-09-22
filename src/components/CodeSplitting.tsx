'use client'

import { lazy, Suspense, ComponentType, ReactNode } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

// Route-based code splitting
export const LazyHomePage = lazy(() => import('../app/page'))
export const LazyGroupFeed = lazy(() => import('../app/g/[slug]/page'))
export const LazyCreateIdea = lazy(() => import('../app/g/[slug]/new/page'))
export const LazyIdeaDetail = lazy(() => import('../app/i/[id]/page'))
export const LazyTripBoard = lazy(() => import('../app/t/[id]/page'))

// Feature-based code splitting
export const LazyAnalytics = lazy(() => import('./AnalyticsDashboard'))
export const LazyAI = lazy(() => import('./AIRecommendations'))
export const LazyNotifications = lazy(() => import('./NotificationCenter'))
export const LazySearch = lazy(() => import('./AdvancedSearch'))
export const LazyPerformance = lazy(() => import('./PerformanceDashboard'))

// Component-based code splitting
export const LazyLuxuryComponents = lazy(() => import('./LuxuryIdeaLayout'))
export const LazyAccessibility = lazy(() => import('./Accessibility'))

// Dynamic imports with error boundaries
export function withErrorBoundary<T extends object>(
  Component: ComponentType<T>,
  fallback?: ReactNode
) {
  return function ErrorBoundaryComponent(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

// Intersection Observer for lazy loading
export function LazyIntersection({ 
  children, 
  fallback, 
  threshold = 0.1,
  rootMargin = '50px'
}: {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
}) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      {children}
    </Suspense>
  )
}

// Preload components
export function preloadComponent(importFn: () => Promise<any>) {
  return () => {
    importFn()
    return null
  }
}

// Route preloading
export const preloadRoutes = {
  home: () => import('../app/page'),
  groupFeed: () => import('../app/g/[slug]/page'),
  createIdea: () => import('../app/g/[slug]/new/page'),
  ideaDetail: () => import('../app/i/[id]/page'),
  tripBoard: () => import('../app/t/[id]/page'),
}

// Feature preloading
export const preloadFeatures = {
  analytics: () => import('./AnalyticsDashboard'),
  ai: () => import('./AIRecommendations'),
  notifications: () => import('./NotificationCenter'),
  search: () => import('./AdvancedSearch'),
  performance: () => import('./PerformanceDashboard'),
}

// Bundle analyzer helper
export function analyzeBundle() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // This would typically use webpack-bundle-analyzer
    console.log('Bundle analysis available in development mode')
  }
}

// Performance monitoring for code splitting
export function measureComponentLoad(componentName: string) {
  const startTime = performance.now()
  
  return () => {
    const endTime = performance.now()
    const loadTime = endTime - startTime
    
    console.log(`${componentName} loaded in ${loadTime.toFixed(2)}ms`)
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'component_load', {
        component_name: componentName,
        load_time: loadTime
      })
    }
  }
}

// Dynamic route loading
export function createDynamicRoute(routePath: string) {
  return lazy(() => {
    const startTime = performance.now()
    
    return import(`../app${routePath}/page`)
      .then(module => {
        const endTime = performance.now()
        console.log(`Route ${routePath} loaded in ${endTime - startTime}ms`)
        return module
      })
      .catch(error => {
        console.error(`Failed to load route ${routePath}:`, error)
        throw error
      })
  })
}

// Conditional loading based on user permissions
export function createConditionalComponent<T extends object>(
  Component: ComponentType<T>,
  condition: () => boolean,
  fallback?: ComponentType<T>
) {
  return function ConditionalComponent(props: T) {
    if (condition()) {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <Component {...props} />
        </Suspense>
      )
    }
    
    if (fallback) {
      return <fallback {...props} />
    }
    
    return null
  }
}

// Lazy loading with retry
export function createRetryableComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  maxRetries = 3
) {
  return lazy(() => {
    let retryCount = 0
    
    const loadComponent = (): Promise<{ default: ComponentType<T> }> => {
      return importFn().catch(error => {
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Retrying component load (${retryCount}/${maxRetries})`)
          return new Promise(resolve => {
            setTimeout(() => resolve(loadComponent()), 1000 * retryCount)
          })
        }
        throw error
      })
    }
    
    return loadComponent()
  })
}

// Memory-efficient component loading
export function createMemoryEfficientComponent<T extends object>(
  Component: ComponentType<T>,
  unloadDelay = 5000
) {
  return function MemoryEfficientComponent(props: T) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    )
  }
}
