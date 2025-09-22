'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  
  // Mock user data - in real app this would come from auth context
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    isAuthenticated: true
  }

  const isAuthenticated = user.isAuthenticated

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
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Group Switcher */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MoodTrip</span>
            </Link>

            {/* Group Switcher */}
            <div className="flex items-center space-x-3">
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
          <div className="flex items-center space-x-4">
            {/* New Idea Button */}
            <Link href={getNewIdeaHref()}>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
