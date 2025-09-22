import fs from 'fs/promises'
import path from 'path'

/**
 * Downloads an image from a URL and saves it to the public directory
 * Returns the public URL path for the saved image
 */
export async function downloadAndSaveImage(
  imageUrl: string, 
  ideaId: string, 
  imageIndex: number
): Promise<string> {
  try {
    // Create idea-specific directory
    const ideaDir = path.join(process.cwd(), 'public', 'images', 'ideas', ideaId)
    await fs.mkdir(ideaDir, { recursive: true })
    
    // Generate filename
    const fileExtension = getFileExtension(imageUrl)
    const filename = `image-${imageIndex + 1}.${fileExtension}`
    const filePath = path.join(ideaDir, filename)
    
    // Download and save the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(filePath, buffer)
    
    // Return the public URL path
    return `/images/ideas/${ideaId}/${filename}`
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error)
    // Return the original URL as fallback
    return imageUrl
  }
}

/**
 * Downloads multiple images and returns their public URLs
 */
export async function downloadAndSaveImages(
  imageUrls: string[], 
  ideaId: string
): Promise<string[]> {
  const downloadPromises = imageUrls.map((url, index) => 
    downloadAndSaveImage(url, ideaId, index)
  )
  
  return Promise.all(downloadPromises)
}

/**
 * Extracts file extension from URL or content type
 */
function getFileExtension(url: string): string {
  // Try to get extension from URL
  const urlPath = new URL(url).pathname
  const extension = path.extname(urlPath).toLowerCase()
  
  if (extension && ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extension)) {
    return extension.slice(1)
  }
  
  // Default to jpg if no valid extension found
  return 'jpg'
}

/**
 * Checks if images already exist for an idea
 */
export async function checkImagesExist(ideaId: string): Promise<boolean> {
  try {
    const ideaDir = path.join(process.cwd(), 'public', 'images', 'ideas', ideaId)
    const files = await fs.readdir(ideaDir)
    return files.length > 0
  } catch {
    return false
  }
}

/**
 * Gets existing image URLs for an idea
 */
export async function getExistingImageUrls(ideaId: string): Promise<string[]> {
  try {
    const ideaDir = path.join(process.cwd(), 'public', 'images', 'ideas', ideaId)
    const files = await fs.readdir(ideaDir)
    
    return files
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
      .sort() // Ensure consistent ordering
      .map(file => `/images/ideas/${ideaId}/${file}`)
  } catch {
    return []
  }
}
