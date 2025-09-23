import { NextRequest, NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

export async function GET(request: NextRequest) {
  try {
    console.log('=== SIMPLE PARAMS TEST START ===')
    
    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
    })
    
    console.log('Testing with simple parameters...')
    const response = await unsplash.search.getPhotos({
      query: 'switzerland mountains',
      perPage: 10,
      orientation: 'landscape'
    })
    
    console.log('Response type:', response.type)
    
    if (response.type === 'success') {
      const urls = response.response.results.map(photo => photo.urls.regular)
      console.log('Success! Got', urls.length, 'images')
      return NextResponse.json({
        success: true,
        urls,
        provider: 'Unsplash (Simple Params Test)'
      })
    } else {
      console.log('Failed response:', response)
      return NextResponse.json({ error: 'Unsplash API failed', response })
    }
  } catch (error) {
    console.error('Simple params test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
