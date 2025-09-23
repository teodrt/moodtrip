import { NextRequest, NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

export async function GET(request: NextRequest) {
  try {
    console.log('=== MINIMAL TEST START ===')
    console.log('Environment check:', process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found')
    
    if (process.env.UNSPLASH_ACCESS_KEY) {
      console.log('Unsplash API key found, attempting to fetch high-quality images...')
      try {
        console.log('Starting Unsplash API call...')
        
        const unsplash = createApi({
          accessKey: process.env.UNSPLASH_ACCESS_KEY
        })
        
        const searchQuery = 'switzerland mountains professional'
        console.log('Search query:', searchQuery)
        
        const response = await unsplash.search.getPhotos({
          query: searchQuery,
          perPage: 20,
          orientation: 'landscape',
          orderBy: 'relevant',
          color: 'all'
        })
        
        console.log('Response type:', response.type)
        console.log('Results count:', response.type === 'success' ? response.response.results.length : 'N/A')
        
        if (response.type === 'success' && response.response.results.length > 0) {
          const urls = response.response.results
            .map(photo => photo.urls.regular)
            .slice(0, 4)
          
          console.log('Success! Got', urls.length, 'images')
          return NextResponse.json({
            success: true,
            urls,
            provider: 'Unsplash (Minimal Test)'
          })
        } else {
          console.log('No results from Unsplash')
          return NextResponse.json({ error: 'No results' })
        }
      } catch (error) {
        console.error('Unsplash API error:', error)
        return NextResponse.json({ error: 'API error', details: error instanceof Error ? error.message : 'Unknown' })
      }
    } else {
      console.log('No Unsplash API key found')
      return NextResponse.json({ error: 'No API key' })
    }
  } catch (error) {
    console.error('Minimal test error:', error)
    return NextResponse.json({ error: 'Test error', details: error instanceof Error ? error.message : 'Unknown' })
  }
}
