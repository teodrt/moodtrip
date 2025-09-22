import OpenAI from 'openai'
import { createApi } from 'unsplash-js'
import { Vibrant } from 'node-vibrant/node'

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || ''
})

// Types
export type ImageSource = 'AI' | 'STOCK'

export interface ImageResult {
  urls: string[]
  provider: string
  source: ImageSource
}

/**
 * Generates images using AI providers with fallback to Unsplash
 * Prefers OpenAI Images or Stability AI, falls back to Unsplash search
 */
export async function generateImages(prompt: string): Promise<ImageResult> {
  try {
    // Try OpenAI Images first
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: prompt,
          n: 4,
          size: '1024x1024',
          quality: 'standard'
        })

        const urls = response.data
          ?.filter(img => img.url)
          .map(img => img.url!)
          .slice(0, 4) || []

        if (urls.length > 0) {
          return {
            urls,
            provider: 'OpenAI DALL-E 3',
            source: 'AI'
          }
        }
      } catch (error) {
        console.warn('OpenAI Images failed, trying Stability AI:', error)
      }
    }

    // TODO: Add Stability AI integration when API is properly configured
    // For now, skip directly to Unsplash fallback

    // Fallback to Unsplash
    if (process.env.UNSPLASH_ACCESS_KEY) {
      try {
        const response = await unsplash.search.getPhotos({
          query: prompt,
          perPage: 4,
          orientation: 'landscape'
        })

        if (response.type === 'success' && response.response.results.length > 0) {
          const urls = response.response.results
            .map(photo => photo.urls.regular)
            .slice(0, 4)

          return {
            urls,
            provider: 'Unsplash',
            source: 'STOCK'
          }
        }
      } catch (error) {
        console.warn('Unsplash failed:', error)
      }
    }

    // If all providers fail, return mock data
    console.warn('All image generation providers failed, returning mock data')
    return {
      urls: [
        `https://picsum.photos/1024/1024?random=${Date.now()}-1`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-2`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-3`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-4`
      ],
      provider: 'Mock (Picsum)',
      source: 'STOCK'
    }
  } catch (error) {
    console.error('Error in generateImages:', error)
    // Return mock data as final fallback
    return {
      urls: [
        `https://picsum.photos/1024/1024?random=${Date.now()}-1`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-2`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-3`,
        `https://picsum.photos/1024/1024?random=${Date.now()}-4`
      ],
      provider: 'Mock (Picsum)',
      source: 'STOCK'
    }
  }
}

/**
 * Generates an AI summary of a travel idea
 */
export async function generateSummary(prompt: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not available, returning mock summary')
      return generateMockSummary(prompt)
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a travel expert who creates evocative, inspiring summaries of travel ideas. 
          Write a 2-3 sentence summary that captures the essence and appeal of the travel experience. 
          Focus on the emotional journey, unique experiences, and what makes this destination special. 
          Use vivid, descriptive language that would inspire someone to visit.`
        },
        {
          role: 'user',
          content: `Create a compelling travel summary for this idea: ${prompt}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content?.trim() || generateMockSummary(prompt)
  } catch (error) {
    console.error('Error generating summary:', error)
    return generateMockSummary(prompt)
  }
}

/**
 * Extracts a color palette from image URLs
 * Returns 5 hex colors
 * Handles both local and remote URLs
 */
export async function extractPalette(urls: string[]): Promise<string[]> {
  try {
    const palettes: string[] = []
    
    for (const url of urls.slice(0, 3)) { // Process up to 3 images
      try {
        // Convert local URLs to absolute URLs for Vibrant
        const absoluteUrl = url.startsWith('/') 
          ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}${url}`
          : url
          
        const palette = await Vibrant.from(absoluteUrl).getPalette()
        
        if (palette.Vibrant) palettes.push(palette.Vibrant.hex)
        if (palette.Muted) palettes.push(palette.Muted.hex)
        if (palette.DarkVibrant) palettes.push(palette.DarkVibrant.hex)
        if (palette.LightVibrant) palettes.push(palette.LightVibrant.hex)
        if (palette.DarkMuted) palettes.push(palette.DarkMuted.hex)
        
        // If we have enough colors, break
        if (palettes.length >= 5) break
      } catch (error) {
        console.warn(`Failed to extract palette from ${url}:`, error)
        continue
      }
    }

    // If we don't have enough colors, fill with defaults
    while (palettes.length < 5) {
      palettes.push(generateRandomColor())
    }

    return palettes.slice(0, 5)
  } catch (error) {
    console.error('Error extracting palette:', error)
    // Return default palette
    return [
      '#8B4513', // Saddle Brown
      '#DAA520', // Goldenrod
      '#F5DEB3', // Wheat
      '#2F4F4F', // Dark Slate Gray
      '#CD853F'  // Peru
    ]
  }
}

/**
 * Generates tags from a travel idea prompt
 */
export async function generateTags(prompt: string): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return generateMockTags(prompt)
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a travel expert who extracts relevant tags from travel descriptions. 
          Return 3-5 short, descriptive tags that capture the key aspects of the travel idea. 
          Focus on: destination type, activities, budget level, travel style, and unique features. 
          Return only the tags, separated by commas, no other text.`
        },
        {
          role: 'user',
          content: `Extract tags from this travel idea: ${prompt}`
        }
      ],
      max_tokens: 50,
      temperature: 0.3
    })

    const tags = response.choices[0]?.message?.content?.trim()
    if (tags) {
      return tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
    }

    return generateMockTags(prompt)
  } catch (error) {
    console.error('Error generating tags:', error)
    return generateMockTags(prompt)
  }
}

// Helper functions
function generateMockSummary(_prompt: string): string {
  const summaries = [
    `A carefully curated travel experience that captures the essence of your vision. This journey combines authentic local experiences with modern comfort, offering a perfect balance of adventure and relaxation.`,
    `An unforgettable adventure that brings your travel dreams to life. Discover hidden gems, immerse yourself in local culture, and create memories that will last a lifetime.`,
    `A thoughtfully designed travel experience that showcases the best of your chosen destination. From breathtaking landscapes to cultural treasures, every moment promises to be extraordinary.`
  ]
  
  return summaries[Math.floor(Math.random() * summaries.length)]
}

function generateMockTags(prompt: string): string[] {
  const commonTags = ['travel', 'adventure', 'culture', 'exploration', 'relaxation', 'nature', 'city', 'beach', 'mountains', 'food', 'history', 'art', 'photography']
  
  // Simple keyword matching for more relevant tags
  const lowerPrompt = prompt.toLowerCase()
  const matchedTags = commonTags.filter(tag => 
    lowerPrompt.includes(tag) || 
    (tag === 'beach' && (lowerPrompt.includes('ocean') || lowerPrompt.includes('coast'))) ||
    (tag === 'mountains' && (lowerPrompt.includes('hiking') || lowerPrompt.includes('peak'))) ||
    (tag === 'food' && (lowerPrompt.includes('restaurant') || lowerPrompt.includes('cuisine')))
  )
  
  // Add some random tags if we don't have enough
  while (matchedTags.length < 3) {
    const randomTag = commonTags[Math.floor(Math.random() * commonTags.length)]
    if (!matchedTags.includes(randomTag)) {
      matchedTags.push(randomTag)
    }
  }
  
  return matchedTags.slice(0, 5)
}

function generateRandomColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
