'use client'

import { usePathname } from 'next/navigation'
import { TopNav } from './TopNav'

interface DynamicTopNavProps {
  groups?: Array<{ slug: string; name: string; memberCount: number }>
}

export function DynamicTopNav({ groups = [] }: DynamicTopNavProps) {
  const pathname = usePathname()
  
  // Extract current group from URL path
  // URL pattern: /g/[slug]/...
  const getCurrentGroup = () => {
    const pathSegments = pathname.split('/')
    if (pathSegments[1] === 'g' && pathSegments[2]) {
      return pathSegments[2]
    }
    return undefined
  }

  const currentGroup = getCurrentGroup()

  return <TopNav currentGroup={currentGroup} groups={groups} />
}
