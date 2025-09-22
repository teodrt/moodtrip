'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, User } from "lucide-react"
import Link from "next/link"

interface NavbarProps {
  user?: {
    id: string
    email: string
    avatar_url?: string
  } | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* App Name */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            MoodTrip
          </Link>

          {/* Center - Group Switcher Placeholder */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Personal</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>

          {/* Right - User Avatar */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
