import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return new Response('Socket.io endpoint - use WebSocket connection', { status: 200 })
}

export async function POST(req: NextRequest) {
  return new Response('Socket.io endpoint - use WebSocket connection', { status: 200 })
}
