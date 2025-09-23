'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
import { LuxuryIdeaLayout } from "@/components/LuxuryIdeaLayout"

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
  const { data: session } = useSession()
  const [isPromoting, setIsPromoting] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localVotes, setLocalVotes] = useState(idea.votes)
  const [localComments, setLocalComments] = useState(idea.comments)

  // Poll for status updates if idea is still being generated
  useEffect(() => {
    if (idea.status === 'DRAFT') {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/ideas/${idea.id}/status`)
          const data = await response.json()
          if (data.status === 'PUBLISHED') {
            // Instead of reloading, we'll show a success message and reload
            console.log('Idea generation completed!')
            window.location.reload()
          }
        } catch (error) {
          console.error('Error polling status:', error)
        }
      }, 3000) // Increased interval to 3 seconds

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

  const handleVote = useCallback(async (ideaId: string, voteType: 'UP' | 'MAYBE' | 'DOWN') => {
    if (isVoting) return
    setIsVoting(true)

    // Optimistic UI update
    setLocalVotes(prev => {
      const newVotes = { ...prev }
      if (voteType === 'UP') newVotes.up++
      else if (voteType === 'MAYBE') newVotes.maybe++
      else if (voteType === 'DOWN') newVotes.down++
      return newVotes
    })

    try {
      const { voteIdea } = await import('@/app/actions')
      await voteIdea(ideaId, voteType)
      // No need to revalidate path here, as votes are handled optimistically
    } catch (error) {
      console.error('Error voting on idea:', error)
      // Revert optimistic update on error
      setLocalVotes(idea.votes)
      // Handle error (e.g., show a toast)
    } finally {
      setIsVoting(false)
    }
  }, [isVoting, idea.votes])

  const handleComment = useCallback(async (ideaId: string, commentBody: string) => {
    if (isCommenting || !commentBody.trim()) return
    setIsCommenting(true)

    // Optimistic UI update
    const newComment = {
      id: `temp-${Date.now()}`, // Temporary ID
      body: commentBody,
      createdAt: new Date(),
      author: { name: 'You', avatar: null }, // Assuming 'You' for optimistic update
    }
    setLocalComments(prev => [...prev, newComment])

    try {
      const { commentIdea } = await import('@/app/actions')
      const result = await commentIdea(ideaId, commentBody)
      // Replace temp comment with real one
      setLocalComments(prev => 
        prev.map(comment => 
          comment.id === newComment.id 
            ? { ...result, author: { name: 'You', avatar: null } }
            : comment
        )
      )
    } catch (error) {
      console.error('Error commenting on idea:', error)
      // Remove temp comment on error
      setLocalComments(prev => prev.filter(comment => comment.id !== newComment.id))
      // Handle error (e.g., show a toast)
    } finally {
      setIsCommenting(false)
    }
  }, [isCommenting])

  const handleDelete = useCallback(async () => {
    if (isDeleting) return
    
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')
    if (!confirmed) return
    
    setIsDeleting(true)
    try {
      const { deleteIdea } = await import('@/app/actions')
      const result = await deleteIdea(idea.id)
      
      if (result.success) {
        // Redirect to the group page after successful deletion
        router.push(`/g/${idea.group.slug}`)
      } else {
        alert(result.error || 'Failed to delete idea')
      }
    } catch (error) {
      console.error('Error deleting idea:', error)
      alert('Failed to delete idea')
    } finally {
      setIsDeleting(false)
    }
  }, [idea.id, idea.group.slug, isDeleting, router])

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
    <LuxuryIdeaLayout
      idea={idea}
      onPromoteToTrip={handlePromoteToTrip}
      isPromoting={isPromoting}
      onVote={handleVote}
      onComment={handleComment}
      onDelete={handleDelete}
      isVoting={isVoting}
      isCommenting={isCommenting}
      isDeleting={isDeleting}
      localVotes={localVotes}
      localComments={localComments}
      currentUserId={session?.user?.id}
    />
  )
}
