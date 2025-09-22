/**
 * Analytics Service
 * 
 * Centralized analytics tracking using PostHog.
 * Provides type-safe event tracking with consistent naming.
 */

import posthog from 'posthog-js'

// Initialize PostHog (only on client side)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_demo_key', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We'll handle this manually
    capture_pageleave: true,
  })
}

// Event types for type safety
export type AnalyticsEvent = 
  | 'idea_created'
  | 'moodboard_generated'
  | 'vote_submitted'
  | 'trip_promoted'
  | 'comment_added'
  | 'availability_updated'
  | 'group_switched'
  | 'page_viewed'

interface EventProperties {
  idea_id?: string
  trip_id?: string
  group_id?: string
  group_slug?: string
  vote_value?: 'UP' | 'MAYBE' | 'DOWN'
  budget_level?: 'LOW' | 'MEDIUM' | 'HIGH'
  kids_friendly?: boolean
  month_hint?: number
  image_count?: number
  palette_colors?: string[]
  task_count?: number
  page_path?: string
  page_title?: string
  user_id?: string
  [key: string]: any
}

/**
 * Track an analytics event
 */
export function trackEvent(event: AnalyticsEvent, properties?: EventProperties) {
  if (typeof window === 'undefined') return

  try {
    posthog.capture(event, {
      timestamp: new Date().toISOString(),
      ...properties,
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
  }
}

/**
 * Identify a user
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return

  try {
    posthog.identify(userId, properties)
  } catch (error) {
    console.error('User identification error:', error)
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined') return

  try {
    posthog.people.set(properties)
  } catch (error) {
    console.error('User properties error:', error)
  }
}

/**
 * Track page views
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return

  try {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      page_path: path,
      page_title: title || document.title,
    })
  } catch (error) {
    console.error('Page view tracking error:', error)
  }
}

/**
 * Track idea creation
 */
export function trackIdeaCreated(ideaId: string, groupId: string, properties?: Partial<EventProperties>) {
  trackEvent('idea_created', {
    idea_id: ideaId,
    group_id: groupId,
    ...properties,
  })
}

/**
 * Track moodboard generation
 */
export function trackMoodboardGenerated(ideaId: string, properties?: Partial<EventProperties>) {
  trackEvent('moodboard_generated', {
    idea_id: ideaId,
    ...properties,
  })
}

/**
 * Track vote submission
 */
export function trackVoteSubmitted(ideaId: string, voteValue: 'UP' | 'MAYBE' | 'DOWN', groupId: string) {
  trackEvent('vote_submitted', {
    idea_id: ideaId,
    vote_value: voteValue,
    group_id: groupId,
  })
}

/**
 * Track trip promotion
 */
export function trackTripPromoted(ideaId: string, tripId: string, groupId: string) {
  trackEvent('trip_promoted', {
    idea_id: ideaId,
    trip_id: tripId,
    group_id: groupId,
  })
}

/**
 * Track comment addition
 */
export function trackCommentAdded(ideaId: string, groupId: string) {
  trackEvent('comment_added', {
    idea_id: ideaId,
    group_id: groupId,
  })
}

/**
 * Track availability update
 */
export function trackAvailabilityUpdated(groupId: string, month: number, score: number) {
  trackEvent('availability_updated', {
    group_id: groupId,
    month_hint: month,
    availability_score: score,
  })
}

/**
 * Track group switching
 */
export function trackGroupSwitched(fromGroup: string, toGroup: string) {
  trackEvent('group_switched', {
    from_group: fromGroup,
    to_group: toGroup,
  })
}

/**
 * Get PostHog instance for advanced usage
 */
export function getPostHog() {
  return posthog
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY
}
