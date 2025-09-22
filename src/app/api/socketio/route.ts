import { NextRequest } from 'next/server'
import { SocketHandler } from '@/lib/socket'

export async function GET(req: NextRequest) {
  return SocketHandler(req, {} as any)
}

export async function POST(req: NextRequest) {
  return SocketHandler(req, {} as any)
}
