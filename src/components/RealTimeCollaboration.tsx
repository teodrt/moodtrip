'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Eye, 
  Edit3, 
  MessageCircle, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useSocket } from '@/hooks/useSocket'
import { useToastActions } from '@/components/ToastSystem'

interface User {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'offline'
  lastSeen?: Date
  currentActivity?: string
  cursor?: {
    x: number
    y: number
  }
}

interface PresenceData {
  users: User[]
  totalOnline: number
  activeUsers: User[]
}

interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'user_typing' | 'user_stopped_typing' | 'cursor_moved' | 'idea_updated' | 'vote_added' | 'comment_added'
  userId: string
  userName: string
  data?: any
  timestamp: Date
}

interface RealTimeCollaborationProps {
  groupId: string
  ideaId?: string
  className?: string
}

export function RealTimeCollaboration({ 
  groupId, 
  ideaId,
  className 
}: RealTimeCollaborationProps) {
  const { socket, isConnected } = useSocket(groupId)
  const [presence, setPresence] = useState<PresenceData>({
    users: [],
    totalOnline: 0,
    activeUsers: []
  })
  const [recentEvents, setRecentEvents] = useState<CollaborationEvent[]>([])
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { success, info } = useToastActions()

  // Handle socket events
  useEffect(() => {
    if (!socket) return

    const handleUserJoined = (data: { user: User }) => {
      setPresence(prev => ({
        ...prev,
        users: [...prev.users.filter(u => u.id !== data.user.id), data.user],
        totalOnline: prev.users.filter(u => u.id !== data.user.id).length + 1
      }))
      
      setRecentEvents(prev => [{
        type: 'user_joined',
        userId: data.user.id,
        userName: data.user.name,
        timestamp: new Date()
      }, ...prev.slice(0, 9)])
      
      success(`${data.user.name} joined the group`)
    }

    const handleUserLeft = (data: { userId: string, userName: string }) => {
      setPresence(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== data.userId),
        totalOnline: prev.users.filter(u => u.id !== data.userId).length
      }))
      
      setRecentEvents(prev => [{
        type: 'user_left',
        userId: data.userId,
        userName: data.userName,
        timestamp: new Date()
      }, ...prev.slice(0, 9)])
      
      info(`${data.userName} left the group`)
    }

    const handleUserTyping = (data: { userId: string, userName: string }) => {
      if (data.userId !== 'current-user') { // Don't show own typing
        setTypingUsers(prev => new Set([...prev, data.userId]))
        setRecentEvents(prev => [{
          type: 'user_typing',
          userId: data.userId,
          userName: data.userName,
          timestamp: new Date()
        }, ...prev.slice(0, 9)])
      }
    }

    const handleUserStoppedTyping = (data: { userId: string }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    }

    const handleCursorMoved = (data: { userId: string, userName: string, cursor: { x: number, y: number } }) => {
      setPresence(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === data.userId 
            ? { ...user, cursor: data.cursor }
            : user
        )
      }))
    }

    const handleIdeaUpdated = (data: { ideaId: string, userId: string, userName: string, changes: any }) => {
      setRecentEvents(prev => [{
        type: 'idea_updated',
        userId: data.userId,
        userName: data.userName,
        data: { ideaId: data.ideaId, changes: data.changes },
        timestamp: new Date()
      }, ...prev.slice(0, 9)])
      
      info(`${data.userName} updated an idea`)
    }

    const handleVoteAdded = (data: { ideaId: string, userId: string, userName: string, voteType: string }) => {
      setRecentEvents(prev => [{
        type: 'vote_added',
        userId: data.userId,
        userName: data.userName,
        data: { ideaId: data.ideaId, voteType: data.voteType },
        timestamp: new Date()
      }, ...prev.slice(0, 9)])
    }

    const handleCommentAdded = (data: { ideaId: string, userId: string, userName: string, comment: string }) => {
      setRecentEvents(prev => [{
        type: 'comment_added',
        userId: data.userId,
        userName: data.userName,
        data: { ideaId: data.ideaId, comment: data.comment },
        timestamp: new Date()
      }, ...prev.slice(0, 9)])
    }

    // Register event listeners
    socket.on('userJoined', handleUserJoined)
    socket.on('userLeft', handleUserLeft)
    socket.on('userTyping', handleUserTyping)
    socket.on('userStoppedTyping', handleUserStoppedTyping)
    socket.on('cursorMoved', handleCursorMoved)
    socket.on('ideaUpdated', handleIdeaUpdated)
    socket.on('voteAdded', handleVoteAdded)
    socket.on('commentAdded', handleCommentAdded)

    // Cleanup
    return () => {
      socket.off('userJoined', handleUserJoined)
      socket.off('userLeft', handleUserLeft)
      socket.off('userTyping', handleUserTyping)
      socket.off('userStoppedTyping', handleUserStoppedTyping)
      socket.off('cursorMoved', handleCursorMoved)
      socket.off('ideaUpdated', handleIdeaUpdated)
      socket.off('voteAdded', handleVoteAdded)
      socket.off('commentAdded', handleCommentAdded)
    }
  }, [socket, success, info])

  // Emit typing events
  const handleTyping = useCallback(() => {
    if (!socket || isTyping) return

    setIsTyping(true)
    socket.emit('userTyping', { groupId })

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('userStoppedTyping', { groupId })
      setIsTyping(false)
    }, 2000)
  }, [socket, groupId, isTyping])

  // Emit cursor movement
  const handleCursorMove = useCallback((e: MouseEvent) => {
    if (!socket) return

    socket.emit('cursorMoved', {
      groupId,
      cursor: { x: e.clientX, y: e.clientY }
    })
  }, [socket, groupId])

  // Emit idea update
  const emitIdeaUpdate = useCallback((ideaId: string, changes: any) => {
    if (!socket) return

    socket.emit('ideaUpdated', {
      groupId,
      ideaId,
      changes
    })
  }, [socket, groupId])

  // Emit vote
  const emitVote = useCallback((ideaId: string, voteType: string) => {
    if (!socket) return

    socket.emit('voteAdded', {
      groupId,
      ideaId,
      voteType
    })
  }, [socket, groupId])

  // Emit comment
  const emitComment = useCallback((ideaId: string, comment: string) => {
    if (!socket) return

    socket.emit('commentAdded', {
      groupId,
      ideaId,
      comment
    })
  }, [socket, groupId])

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  // Get activity icon
  const getActivityIcon = (activity?: string) => {
    switch (activity) {
      case 'editing': return <Edit3 className="h-3 w-3" />
      case 'viewing': return <Eye className="h-3 w-3" />
      case 'commenting': return <MessageCircle className="h-3 w-3" />
      case 'voting': return <ThumbsUp className="h-3 w-3" />
      default: return <Clock className="h-3 w-3" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          {presence.totalOnline} online
        </Badge>
      </div>

      {/* Active Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {presence.users.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No active users</p>
              </div>
            ) : (
              <div className="space-y-2">
                {presence.users.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        {user.currentActivity && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            {getActivityIcon(user.currentActivity)}
                            <span>{user.currentActivity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {typingUsers.has(user.id) && (
                        <Badge variant="secondary" className="text-xs animate-pulse">
                          typing...
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentEvents.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <AnimatePresence>
                {recentEvents.map((event, index) => (
                  <motion.div
                    key={`${event.timestamp.getTime()}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0">
                      {event.type === 'user_joined' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {event.type === 'user_left' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {event.type === 'user_typing' && <Edit3 className="h-4 w-4 text-blue-500" />}
                      {event.type === 'idea_updated' && <Edit3 className="h-4 w-4 text-purple-500" />}
                      {event.type === 'vote_added' && <ThumbsUp className="h-4 w-4 text-yellow-500" />}
                      {event.type === 'comment_added' && <MessageCircle className="h-4 w-4 text-indigo-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium">{event.userName}</span>
                        {' '}
                        {event.type === 'user_joined' && 'joined the group'}
                        {event.type === 'user_left' && 'left the group'}
                        {event.type === 'user_typing' && 'is typing...'}
                        {event.type === 'idea_updated' && 'updated an idea'}
                        {event.type === 'vote_added' && `voted ${event.data?.voteType} on an idea`}
                        {event.type === 'comment_added' && 'added a comment'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Typing Indicator */}
      <AnimatePresence>
        {typingUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-blue-700">
              {Array.from(typingUsers).length === 1 
                ? 'Someone is typing...' 
                : `${Array.from(typingUsers).length} people are typing...`
              }
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for using real-time collaboration
export function useRealTimeCollaboration(groupId: string, ideaId?: string) {
  const { socket, isConnected } = useSocket(groupId)
  const { success, info } = useToastActions()

  const emitTyping = useCallback(() => {
    if (!socket) return
    socket.emit('userTyping', { groupId })
  }, [socket, groupId])

  const emitStoppedTyping = useCallback(() => {
    if (!socket) return
    socket.emit('userStoppedTyping', { groupId })
  }, [socket, groupId])

  const emitIdeaUpdate = useCallback((changes: any) => {
    if (!socket || !ideaId) return
    socket.emit('ideaUpdated', { groupId, ideaId, changes })
  }, [socket, groupId, ideaId])

  const emitVote = useCallback((voteType: string) => {
    if (!socket || !ideaId) return
    socket.emit('voteAdded', { groupId, ideaId, voteType })
  }, [socket, groupId, ideaId])

  const emitComment = useCallback((comment: string) => {
    if (!socket || !ideaId) return
    socket.emit('commentAdded', { groupId, ideaId, comment })
  }, [socket, groupId, ideaId])

  return {
    isConnected,
    emitTyping,
    emitStoppedTyping,
    emitIdeaUpdate,
    emitVote,
    emitComment
  }
}
