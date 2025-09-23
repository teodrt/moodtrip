import { NextRequest, NextResponse } from 'next/server'
import { generateImages } from '@/lib/ai'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prompt = searchParams.get('prompt') || 'switzerland mountains'
    
    console.log('Testing image generation with prompt:', prompt)
    console.log('Environment check - UNSPLASH_ACCESS_KEY:', process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found')
    
    const result = await generateImages(prompt)
    
    return NextResponse.json({
      success: true,
      prompt,
      result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing image generation:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
