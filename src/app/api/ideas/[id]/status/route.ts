import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idea = await prisma.idea.findUnique({
      where: { id },
      select: { status: true }
    })

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    return NextResponse.json({ status: idea.status })
  } catch (error) {
    console.error('Error fetching idea status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
