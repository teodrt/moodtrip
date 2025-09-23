import { NextRequest, NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

export async function GET(request: NextRequest) {
  try {
    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
    })
    
    console.log('Testing Unsplash API directly...')
    
    const response = await unsplash.search.getPhotos({
      query: 'switzerland mountains',
      perPage: 5,
      orientation: 'landscape'
    })
    
    console.log('Unsplash response type:', response.type)
    
    if (response.type === 'success') {
      const urls = response.response.results.map(photo => photo.urls.regular)
      return NextResponse.json({
        success: true,
        urls,
        count: urls.length
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Unsplash API returned error',
        response
      })
    }
  } catch (error) {
    console.error('Unsplash test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
