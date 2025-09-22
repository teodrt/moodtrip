'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views on route changes
    trackPageView(pathname)
  }, [pathname])

  return <>{children}</>
}
