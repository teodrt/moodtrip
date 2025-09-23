import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'

export type NextApiResponseServerIO = any & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const SocketHandler = (req: any, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_SITE_URL 
          : 'http://localhost:3015',
        methods: ['GET', 'POST'],
      },
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id)

      // Join group room
      socket.on('join-group', (data: { groupId: string; userId: string; userName: string }) => {
        socket.join(`group-${data.groupId}`)
        socket.data = { ...socket.data, groupId: data.groupId, userId: data.userId, userName: data.userName }
        console.log(`Socket ${socket.id} (${data.userName}) joined group ${data.groupId}`)
        
        // Notify others in the group
        socket.to(`group-${data.groupId}`).emit('user-joined', {
          userId: data.userId,
          userName: data.userName,
          timestamp: new Date().toISOString()
        })
      })

      // Leave group room
      socket.on('leave-group', (groupId: string) => {
        socket.leave(`group-${groupId}`)
        console.log(`Socket ${socket.id} left group ${groupId}`)
        
        // Notify others in the group
        socket.to(`group-${groupId}`).emit('user-left', {
          userId: socket.data?.userId,
          userName: socket.data?.userName,
          timestamp: new Date().toISOString()
        })
      })

      // Handle idea updates
      socket.on('idea-updated', (data: { groupId: string; ideaId: string; updates: any; userId: string }) => {
        socket.to(`group-${data.groupId}`).emit('idea-updated', {
          ...data,
          timestamp: new Date().toISOString()
        })
      })

      // Handle new ideas
      socket.on('new-idea', (data: { groupId: string; idea: any; userId: string }) => {
        socket.to(`group-${data.groupId}`).emit('new-idea', {
          ...data,
          timestamp: new Date().toISOString()
        })
      })

      // Handle votes
      socket.on('vote-updated', (data: { groupId: string; ideaId: string; voteCounts: any; userId: string; voteType: string }) => {
        socket.to(`group-${data.groupId}`).emit('vote-updated', {
          ...data,
          timestamp: new Date().toISOString()
        })
      })

      // Handle comments
      socket.on('comment-added', (data: { groupId: string; ideaId: string; comment: any; userId: string }) => {
        socket.to(`group-${data.groupId}`).emit('comment-added', {
          ...data,
          timestamp: new Date().toISOString()
        })
      })

      // Handle typing indicators
      socket.on('typing-start', (data: { groupId: string; ideaId: string; userId: string; userName: string }) => {
        socket.to(`group-${data.groupId}`).emit('user-typing', {
          ...data,
          isTyping: true,
          timestamp: new Date().toISOString()
        })
      })

      socket.on('typing-stop', (data: { groupId: string; ideaId: string; userId: string }) => {
        socket.to(`group-${data.groupId}`).emit('user-typing', {
          ...data,
          isTyping: false,
          timestamp: new Date().toISOString()
        })
      })

      // Handle online users
      socket.on('get-online-users', (groupId: string) => {
        const room = io.sockets.adapter.rooms.get(`group-${groupId}`)
        if (room) {
          const onlineUsers = Array.from(room).map(socketId => {
            const socket = io.sockets.sockets.get(socketId)
            return {
              userId: socket?.data?.userId,
              userName: socket?.data?.userName,
              socketId
            }
          }).filter(user => user.userId)
          
          socket.emit('online-users', onlineUsers)
        }
      })

      // Handle moodboard generation progress
      socket.on('moodboard-generating', (data: { groupId: string; ideaId: string; progress: number; stage: string }) => {
        socket.to(`group-${data.groupId}`).emit('moodboard-progress', {
          ...data,
          timestamp: new Date().toISOString()
        })
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        
        // Notify group if user was in one
        if (socket.data?.groupId) {
          socket.to(`group-${socket.data.groupId}`).emit('user-left', {
            userId: socket.data.userId,
            userName: socket.data.userName,
            timestamp: new Date().toISOString()
          })
        }
      })
    })
  }
  res.end()
}
