'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

interface OnlineUser {
  userId: string
  userName: string
  socketId: string
}

interface RealtimeEvents {
  onIdeaUpdated?: (data: any) => void
  onNewIdea?: (data: any) => void
  onVoteUpdated?: (data: any) => void
  onCommentAdded?: (data: any) => void
  onUserJoined?: (data: any) => void
  onUserLeft?: (data: any) => void
  onUserTyping?: (data: any) => void
  onMoodboardProgress?: (data: any) => void
}

export function useRealtimeCollaboration(groupId: string, events: RealtimeEvents = {}) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!session?.user?.id || !groupId) return

    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3015'
      : 'http://localhost:3015', {
      path: '/api/socketio',
      autoConnect: true,
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to real-time server')
      setIsConnected(true)
      
      // Join group
      newSocket.emit('join-group', {
        groupId,
        userId: session.user.id,
        userName: session.user.name || session.user.email
      })
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from real-time server')
      setIsConnected(false)
    })

    // Group events
    newSocket.on('user-joined', (data) => {
      console.log('User joined:', data)
      events.onUserJoined?.(data)
    })

    newSocket.on('user-left', (data) => {
      console.log('User left:', data)
      events.onUserLeft?.(data)
    })

    newSocket.on('online-users', (users: OnlineUser[]) => {
      setOnlineUsers(users)
    })

    // Idea events
    newSocket.on('idea-updated', (data) => {
      console.log('Idea updated:', data)
      events.onIdeaUpdated?.(data)
    })

    newSocket.on('new-idea', (data) => {
      console.log('New idea:', data)
      events.onNewIdea?.(data)
    })

    newSocket.on('vote-updated', (data) => {
      console.log('Vote updated:', data)
      events.onVoteUpdated?.(data)
    })

    newSocket.on('comment-added', (data) => {
      console.log('Comment added:', data)
      events.onCommentAdded?.(data)
    })

    // Typing events
    newSocket.on('user-typing', (data) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.userId]: data.isTyping
      }))
      events.onUserTyping?.(data)
    })

    // Moodboard progress
    newSocket.on('moodboard-progress', (data) => {
      console.log('Moodboard progress:', data)
      events.onMoodboardProgress?.(data)
    })

    // Request online users
    newSocket.emit('get-online-users', groupId)

    return () => {
      newSocket.emit('leave-group', groupId)
      newSocket.disconnect()
      socketRef.current = null
    }
  }, [session?.user?.id, groupId])

  // Emit functions
  const emitIdeaUpdate = (ideaId: string, updates: any) => {
    if (socket && isConnected) {
      socket.emit('idea-updated', {
        groupId,
        ideaId,
        updates,
        userId: session?.user?.id
      })
    }
  }

  const emitNewIdea = (idea: any) => {
    if (socket && isConnected) {
      socket.emit('new-idea', {
        groupId,
        idea,
        userId: session?.user?.id
      })
    }
  }

  const emitVoteUpdate = (ideaId: string, voteCounts: any, voteType: string) => {
    if (socket && isConnected) {
      socket.emit('vote-updated', {
        groupId,
        ideaId,
        voteCounts,
        userId: session?.user?.id,
        voteType
      })
    }
  }

  const emitCommentAdded = (ideaId: string, comment: any) => {
    if (socket && isConnected) {
      socket.emit('comment-added', {
        groupId,
        ideaId,
        comment,
        userId: session?.user?.id
      })
    }
  }

  const emitTypingStart = (ideaId: string) => {
    if (socket && isConnected) {
      socket.emit('typing-start', {
        groupId,
        ideaId,
        userId: session?.user?.id,
        userName: session?.user?.name || session?.user?.email
      })
    }
  }

  const emitTypingStop = (ideaId: string) => {
    if (socket && isConnected) {
      socket.emit('typing-stop', {
        groupId,
        ideaId,
        userId: session?.user?.id
      })
    }
  }

  const emitMoodboardProgress = (ideaId: string, progress: number, stage: string) => {
    if (socket && isConnected) {
      socket.emit('moodboard-generating', {
        groupId,
        ideaId,
        progress,
        stage
      })
    }
  }

  return {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    emitIdeaUpdate,
    emitNewIdea,
    emitVoteUpdate,
    emitCommentAdded,
    emitTypingStart,
    emitTypingStop,
    emitMoodboardProgress
  }
}
