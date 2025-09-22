'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ImageMosaicProps {
  images: Array<{
    id: string
    url: string
    source: string
    provider: string | null
  }>
}

export function ImageMosaic({ images }: ImageMosaicProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId))
  }

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Visual Inspiration</h2>
        <div className="grid grid-cols-2 gap-2 h-64 rounded-lg overflow-hidden bg-gray-100">
          <div className="row-span-2 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm">No images available</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-32 bg-gray-200 rounded"></div>
            <div className="w-full h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Visual Inspiration</h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-80 rounded-lg overflow-hidden"
        >
          <img
            src={images[0].url}
            alt="Main inspiration"
            className="w-full h-full object-cover"
            onLoad={() => handleImageLoad(images[0].id)}
          />
          {loadedImages.has(images[0].id) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
            />
          )}
        </motion.div>
      </div>
    )
  }

  if (images.length === 2) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Visual Inspiration</h2>
        <div className="grid grid-cols-2 gap-2 h-80 rounded-lg overflow-hidden">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="relative"
            >
              <img
                src={image.url}
                alt={`Inspiration ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => handleImageLoad(image.id)}
              />
              {loadedImages.has(image.id) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (images.length === 3) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Visual Inspiration</h2>
        <div className="grid grid-cols-2 gap-2 h-80 rounded-lg overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="row-span-2 relative"
          >
            <img
              src={images[0].url}
              alt="Main inspiration"
              className="w-full h-full object-cover"
              onLoad={() => handleImageLoad(images[0].id)}
            />
            {loadedImages.has(images[0].id) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
              />
            )}
          </motion.div>
          <div className="space-y-2">
            {images.slice(1, 3).map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1, ease: "easeOut" }}
                className="relative h-39"
              >
                <img
                  src={image.url}
                  alt={`Inspiration ${index + 2}`}
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(image.id)}
                />
                {loadedImages.has(image.id) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 4+ images - Masonry layout
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Visual Inspiration</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-80 rounded-lg overflow-hidden">
        {images.slice(0, 5).map((image, index) => {
          const isMain = index === 0
          const isWide = index === 1 || index === 4
          
          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className={`relative ${
                isMain ? 'row-span-2 col-span-1' : 
                isWide ? 'col-span-1' : 'col-span-1'
              }`}
            >
              <img
                src={image.url}
                alt={`Inspiration ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => handleImageLoad(image.id)}
              />
              {loadedImages.has(image.id) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
