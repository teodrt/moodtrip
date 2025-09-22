'use client'

import { Badge } from '@/components/ui/badge'
import { ImageIcon, Sparkles, Camera } from 'lucide-react'

interface ImageProviderBadgeProps {
  provider: string
  source: 'AI' | 'STOCK'
  className?: string
}

export function ImageProviderBadge({ provider, source, className }: ImageProviderBadgeProps) {
  const getIcon = () => {
    if (source === 'AI') {
      return <Sparkles className="h-3 w-3" />
    }
    return <Camera className="h-3 w-3" />
  }

  const getVariant = () => {
    if (source === 'AI') {
      return 'default' as const
    }
    return 'secondary' as const
  }

  return (
    <Badge 
      variant={getVariant()} 
      className={`text-xs flex items-center gap-1 ${className}`}
    >
      {getIcon()}
      <span>{provider}</span>
    </Badge>
  )
}
