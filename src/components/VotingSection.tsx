'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThumbsUp, HelpCircle, ThumbsDown } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface VotingSectionProps {
  ideaId: string
  initialVotes: {
    up: number
    maybe: number
    down: number
  }
}

export function VotingSection({ ideaId, initialVotes }: VotingSectionProps) {
  const { toast } = useToast()
  const [votes, setVotes] = useState(initialVotes)
  const [userVote, setUserVote] = useState<'up' | 'maybe' | 'down' | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType: 'up' | 'maybe' | 'down') => {
    if (isVoting) return

    const previousVote = userVote
    const previousVotes = { ...votes }

    // Optimistic update
    setIsVoting(true)
    
    // Update user vote
    setUserVote(voteType)
    
    // Update vote counts optimistically
    if (previousVote) {
      // Remove previous vote
      setVotes(prev => ({
        ...prev,
        [previousVote]: prev[previousVote] - 1
      }))
    }
    
    if (voteType !== previousVote) {
      // Add new vote
      setVotes(prev => ({
        ...prev,
        [voteType]: prev[voteType] + 1
      }))
    } else {
      // Same vote clicked, remove it
      setUserVote(null)
      setVotes(prev => ({
        ...prev,
        [voteType]: prev[voteType] - 1
      }))
    }

    try {
      const { voteIdea } = await import('@/app/actions')
      await voteIdea(ideaId, voteType.toUpperCase() as 'UP' | 'MAYBE' | 'DOWN')
      
      toast({
        title: "Vote recorded",
        description: `Your ${voteType} vote has been recorded.`,
      })
    } catch (error) {
      console.error('Error voting:', error)
      
      // Revert optimistic update on error
      setUserVote(previousVote)
      setVotes(previousVotes)
      
      toast({
        title: "Vote failed",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const getVoteButtonVariant = (voteType: 'up' | 'maybe' | 'down') => {
    if (userVote === voteType) return 'default'
    return 'outline'
  }

  const getVoteButtonClass = (voteType: 'up' | 'maybe' | 'down') => {
    const baseClass = "flex items-center gap-2 transition-all duration-200"
    const activeClass = userVote === voteType ? "shadow-md" : "hover:shadow-sm"
    return `${baseClass} ${activeClass}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-900">What do you think?</h3>
      <div className="flex gap-3">
        <Button
          variant={getVoteButtonVariant('up')}
          onClick={() => handleVote('up')}
          disabled={isVoting}
          className={getVoteButtonClass('up')}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{votes.up}</span>
        </Button>
        
        <Button
          variant={getVoteButtonVariant('maybe')}
          onClick={() => handleVote('maybe')}
          disabled={isVoting}
          className={getVoteButtonClass('maybe')}
        >
          <HelpCircle className="h-4 w-4" />
          <span className="font-medium">{votes.maybe}</span>
        </Button>
        
        <Button
          variant={getVoteButtonVariant('down')}
          onClick={() => handleVote('down')}
          disabled={isVoting}
          className={getVoteButtonClass('down')}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="font-medium">{votes.down}</span>
        </Button>
      </div>
      
      {isVoting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 flex items-center gap-2"
        >
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
          Recording your vote...
        </motion.div>
      )}
    </motion.div>
  )
}
