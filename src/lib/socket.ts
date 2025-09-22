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
          : 'http://localhost:3001',
        methods: ['GET', 'POST'],
      },
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id)

      // Join group room
      socket.on('join-group', (groupId: string) => {
        socket.join(`group-${groupId}`)
        console.log(`Socket ${socket.id} joined group ${groupId}`)
      })

      // Leave group room
      socket.on('leave-group', (groupId: string) => {
        socket.leave(`group-${groupId}`)
        console.log(`Socket ${socket.id} left group ${groupId}`)
      })

      // Handle idea updates
      socket.on('idea-updated', (data: { groupId: string; ideaId: string; updates: any }) => {
        socket.to(`group-${data.groupId}`).emit('idea-updated', data)
      })

      // Handle new ideas
      socket.on('new-idea', (data: { groupId: string; idea: any }) => {
        socket.to(`group-${data.groupId}`).emit('new-idea', data)
      })

      // Handle votes
      socket.on('vote-updated', (data: { groupId: string; ideaId: string; voteCounts: any }) => {
        socket.to(`group-${data.groupId}`).emit('vote-updated', data)
      })

      // Handle comments
      socket.on('comment-added', (data: { groupId: string; ideaId: string; comment: any }) => {
        socket.to(`group-${data.groupId}`).emit('comment-added', data)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  res.end()
}
