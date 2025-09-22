'use client'

import { lazy, Suspense, ComponentType } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

// Lazy load heavy components
export const LazyAnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'))
export const LazyAIRecommendations = lazy(() => import('./AIRecommendations'))
export const LazyNotificationCenter = lazy(() => import('./NotificationCenter'))
export const LazyAdvancedSearch = lazy(() => import('./AdvancedSearch'))
export const LazyPerformanceDashboard = lazy(() => import('./PerformanceDashboard'))

// Lazy load luxury components
export const LazyLuxuryIdeaLayout = lazy(() => import('./LuxuryIdeaLayout'))
export const LazyLuxuryCreateIdeaForm = lazy(() => import('./LuxuryCreateIdeaForm'))

// Lazy load accessibility components
export const LazyAccessibilitySettings = lazy(() => import('./Accessibility').then(m => ({ default: m.AccessibilitySettings })))

// Generic lazy wrapper with loading fallback
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyWrapper({ children, fallback = <LoadingSpinner /> }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyLoadedComponent(props: T) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

// Lazy load with intersection observer
export function LazyIntersection({ children, fallback }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      {children}
    </Suspense>
  )
}
