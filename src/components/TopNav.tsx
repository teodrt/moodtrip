'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Plus, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  LogIn,
  Users,
  Sparkles
} from 'lucide-react'

interface TopNavProps {
  currentGroup?: string
  groups?: Array<{ slug: string; name: string; memberCount: number }>
}

export function TopNav({ currentGroup, groups = [] }: TopNavProps) {
  const pathname = usePathname()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const { data: session, status } = useSession()
  const isAuthenticated = !!session?.user

  const handleGroupChange = (newGroupSlug: string) => {
    if (newGroupSlug !== currentGroup) {
      window.location.href = `/g/${newGroupSlug}`
    }
  }

  const getNewIdeaHref = () => {
    if (currentGroup) {
      return `/g/${currentGroup}/new`
    }
    return '/g/family/new' // Default fallback
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and Group Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-title sm:text-headline font-heading text-gray-900">MoodTrip</span>
            </Link>

            {/* Group Switcher - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-3">
              <Users className="h-4 w-4 text-gray-500" />
              <Select 
                value={currentGroup || 'family'} 
                onValueChange={handleGroupChange}
              >
                <SelectTrigger className="w-48 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.slug} value={group.slug}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{group.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {group.memberCount}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Side - New Idea Button and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* New Idea Button */}
            <Link href={getNewIdeaHref()}>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base px-3 sm:px-4">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">New Idea</span>
                <span className="xs:hidden">+</span>
              </Button>
            </Link>

            {/* Auth Button */}
            {isAuthenticated ? (
              <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 px-4 py-2">
                    <User className="h-4 w-4 mr-2" />
                    {session?.user?.name || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="h-9 px-4 py-2">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
