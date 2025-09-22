"use client"

import { SessionProvider } from "next-auth/react"
import { PostHogProvider } from "@/components/PostHogProvider"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <PostHogProvider>
        {children}
      </PostHogProvider>
    </SessionProvider>
  )
}
