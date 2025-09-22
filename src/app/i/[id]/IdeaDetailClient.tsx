'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, DollarSign, Baby, Plane } from "lucide-react"
import Link from "next/link"
import { ImageMosaic } from "@/components/ImageMosaic"
import { ColorPalette } from "@/components/ColorPalette"
import { VotingSection } from "@/components/VotingSection"
import { CommentsSection } from "@/components/CommentsSection"
import { EmptyIdeaImages, EmptyComments } from "@/components/EmptyStates"

interface IdeaDetailClientProps {
  idea: {
    id: string
    title: string
    prompt: string
    status: string
    tags: string[]
    palette: string[]
    summary: string | null
    budgetLevel: string | null
    monthHint: number | null
    kidsFriendly: boolean
    createdAt: Date
    images: Array<{
      id: string
      url: string
      source: string
      provider: string | null
    }>
    votes: {
      up: number
      maybe: number
      down: number
    }
    comments: Array<{
      id: string
      body: string
      createdAt: Date
      author: {
        name: string
        avatar: string | null
      }
    }>
    author: {
      name: string
      avatar: string | null
    }
    group: {
      slug: string
    }
  }
}

export function IdeaDetailClient({ idea }: IdeaDetailClientProps) {
  const router = useRouter()
  const [isPromoting, setIsPromoting] = useState(false)

  // Poll for status updates if idea is still being generated
  useEffect(() => {
    if (idea.status === 'DRAFT') {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/ideas/${idea.id}/status`)
          const data = await response.json()
          if (data.status === 'PUBLISHED') {
            window.location.reload()
          }
        } catch (error) {
          console.error('Error polling status:', error)
        }
      }, 2000)

      return () => clearInterval(pollInterval)
    }
  }, [idea.id, idea.status])


  const handlePromoteToTrip = async () => {
    if (isPromoting) return
    setIsPromoting(true)
    try {
      const { promoteToTrip } = await import('@/app/actions')
      const result = await promoteToTrip(idea.id)
      router.push(`/t/${result.tripId}`)
    } catch (error) {
      console.error('Error promoting to trip:', error)
    } finally {
      setIsPromoting(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getBudgetIcon = (level: string | null) => {
    switch (level) {
      case 'LOW': return '💰'
      case 'MEDIUM': return '💳'
      case 'HIGH': return '💎'
      default: return '💵'
    }
  }

  const getMonthName = (month: number | null) => {
    if (!month) return null
    return new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/g/${idea.group.slug}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {idea.group.slug} group
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {idea.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {formatDate(idea.createdAt)} • by {idea.author.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="md:col-span-2 space-y-8">
                    {/* Image Mosaic */}
                    {idea.images.length > 0 ? (
                      <ImageMosaic images={idea.images} />
                    ) : (
                      <EmptyIdeaImages />
                    )}

                    {/* Color Palette */}
                    <ColorPalette colors={idea.palette} />

            {/* AI Summary */}
            {idea.summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-900">AI Summary</h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">{idea.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Voting Section */}
            <VotingSection ideaId={idea.id} initialVotes={idea.votes} />

            {/* Comments Section */}
            <CommentsSection ideaId={idea.id} initialComments={idea.comments} />
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={idea.author.avatar || undefined} />
                      <AvatarFallback>
                        {idea.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{idea.author.name}</h3>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Idea Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Idea Details</CardTitle>
                  <CardDescription>Additional information about this travel idea</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {idea.budgetLevel && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        Budget
                      </span>
                      <Badge variant="secondary">
                        {getBudgetIcon(idea.budgetLevel)} {idea.budgetLevel}
                      </Badge>
                    </div>
                  )}
                  
                  {idea.monthHint && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Month
                      </span>
                      <Badge variant="secondary">
                        {getMonthName(idea.monthHint)}
                      </Badge>
                    </div>
                  )}
                  
                  {idea.kidsFriendly && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Baby className="h-4 w-4" />
                        Kids-friendly
                      </span>
                      <Badge variant="secondary">Yes</Badge>
                    </div>
                  )}

                  {idea.tags.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Tags</span>
                      <div className="flex flex-wrap gap-1">
                        {idea.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Promote to Trip - Only show to author or admin */}
            {(idea.author.name === 'You' || idea.author.name === 'Admin') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Plan?</CardTitle>
                    <CardDescription>
                      Turn this idea into a real trip
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handlePromoteToTrip}
                      disabled={isPromoting}
                      className="w-full"
                    >
                      {isPromoting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Trip...
                        </>
                      ) : (
                        <>
                          <Plane className="h-4 w-4 mr-2" />
                          Promote to Trip
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
