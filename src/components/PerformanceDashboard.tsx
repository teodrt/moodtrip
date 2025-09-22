'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { usePerformance } from '@/hooks/usePerformance'
import { 
  Gauge, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  BarChart3,
  Activity
} from 'lucide-react'

interface PerformanceDashboardProps {
  isVisible?: boolean
  onClose?: () => void
}

export function PerformanceDashboard({ isVisible = false, onClose }: PerformanceDashboardProps) {
  const { metrics, isSupported, logMetrics, getPerformanceScore, measurePerformance } = usePerformance()
  const [isExpanded, setIsExpanded] = useState(false)

  const performanceScore = getPerformanceScore()

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    if (score >= 70) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default'
    if (score >= 80) return 'secondary'
    if (score >= 70) return 'outline'
    return 'destructive'
  }

  const formatMetric = (value: number | null, unit: string = 'ms') => {
    if (value === null) return 'N/A'
    return `${value.toFixed(0)}${unit}`
  }

  const getMetricStatus = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return 'unknown'
    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.poor) return 'warning'
    return 'poor'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Performance</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {performanceScore && (
                <Badge variant={getScoreBadgeVariant(performanceScore.score)}>
                  {performanceScore.grade}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? '−' : '+'}
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              )}
            </div>
          </div>
          {performanceScore && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overall Score</span>
                <span className={`text-lg font-bold ${getScoreColor(performanceScore.score)}`}>
                  {performanceScore.score}/100
                </span>
              </div>
              <Progress 
                value={performanceScore.score} 
                className="h-2"
              />
            </div>
          )}
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Core Web Vitals */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Core Web Vitals
              </h4>
              
              <div className="space-y-2">
                {/* FCP */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(getMetricStatus(metrics.fcp, { good: 1800, poor: 3000 }))}
                    <span className="text-sm">FCP</span>
                  </div>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.fcp)}
                  </span>
                </div>

                {/* LCP */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(getMetricStatus(metrics.lcp, { good: 2500, poor: 4000 }))}
                    <span className="text-sm">LCP</span>
                  </div>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.lcp)}
                  </span>
                </div>

                {/* CLS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(getMetricStatus(metrics.cls, { good: 0.1, poor: 0.25 }))}
                    <span className="text-sm">CLS</span>
                  </div>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.cls, '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Additional Metrics
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">TTFB</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.ttfb)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Load Time</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.loadTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DOM Ready</span>
                  <span className="text-sm font-mono">
                    {formatMetric(metrics.domContentLoaded)}
                  </span>
                </div>
              </div>
            </div>

            {/* Issues */}
            {performanceScore && performanceScore.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-red-700 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Issues
                </h4>
                <div className="space-y-1">
                  {performanceScore.issues.map((issue, index) => (
                    <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={measurePerformance}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logMetrics}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Log
              </Button>
            </div>

            {/* Support Status */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              {isSupported ? (
                <span className="text-green-600">✓ Performance API supported</span>
              ) : (
                <span className="text-red-600">✗ Performance API not supported</span>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

// Floating Performance Toggle
export function PerformanceToggle() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or if explicitly enabled
    if (process.env.NODE_ENV === 'development' || 
        (typeof window !== 'undefined' && window.localStorage.getItem('showPerformance'))) {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  return (
    <PerformanceDashboard 
      isVisible={isVisible} 
      onClose={() => setIsVisible(false)} 
    />
  )
}
