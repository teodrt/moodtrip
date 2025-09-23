import { NextRequest, NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

export async function GET(request: NextRequest) {
  try {
    console.log('=== SIMPLE TEST START ===')
    console.log('Environment check:', process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found')
    
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({ error: 'No Unsplash API key' })
    }
    
    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY
    })
    
    console.log('Making simple Unsplash call...')
    const response = await unsplash.search.getPhotos({
      query: 'switzerland mountains',
      perPage: 4,
      orientation: 'landscape'
    })
    
    console.log('Response type:', response.type)
    
    if (response.type === 'success') {
      const urls = response.response.results.map(photo => photo.urls.regular)
      console.log('Success! Got', urls.length, 'images')
      return NextResponse.json({
        success: true,
        urls,
        provider: 'Unsplash (Simple Test)'
      })
    } else {
      console.log('Failed response:', response)
      return NextResponse.json({ error: 'Unsplash API failed', response })
    }
  } catch (error) {
    console.error('Simple test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
