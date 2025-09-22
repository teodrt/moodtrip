'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001', {
      path: '/api/socketio',
    })

    socketInstance.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.close()
    }
  }, [])

  return { socket, isConnected }
}

export function useGroupSocket(groupId: string) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (socket && groupId) {
      socket.emit('join-group', groupId)
      
      return () => {
        socket.emit('leave-group', groupId)
      }
    }
  }, [socket, groupId])

  const emitIdeaUpdate = (ideaId: string, updates: any) => {
    if (socket) {
      socket.emit('idea-updated', { groupId, ideaId, updates })
    }
  }

  const emitNewIdea = (idea: any) => {
    if (socket) {
      socket.emit('new-idea', { groupId, idea })
    }
  }

  const emitVoteUpdate = (ideaId: string, voteCounts: any) => {
    if (socket) {
      socket.emit('vote-updated', { groupId, ideaId, voteCounts })
    }
  }

  const emitCommentAdded = (ideaId: string, comment: any) => {
    if (socket) {
      socket.emit('comment-added', { groupId, ideaId, comment })
    }
  }

  return {
    socket,
    isConnected,
    emitIdeaUpdate,
    emitNewIdea,
    emitVoteUpdate,
    emitCommentAdded,
  }
}
