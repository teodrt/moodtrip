import { NextRequest, NextResponse } from 'next/server'
import { generateImages } from '@/lib/ai'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DIRECT TEST START ===')
    console.log('Environment check:', process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found')
    
    const result = await generateImages('test prompt')
    
    console.log('=== DIRECT TEST RESULT ===')
    console.log('Provider:', result.provider)
    console.log('URLs count:', result.urls.length)
    
    return NextResponse.json({
      success: true,
      result,
      envCheck: process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found'
    })
  } catch (error) {
    console.error('Direct test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
