'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle, Send } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface Comment {
  id: string
  body: string
  createdAt: Date
  author: {
    name: string
    avatar: string | null
  }
}

interface CommentsSectionProps {
  ideaId: string
  initialComments: Comment[]
}

export function CommentsSection({ ideaId, initialComments }: CommentsSectionProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    const commentText = newComment.trim()
    setNewComment('')

    // Optimistic update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      body: commentText,
      createdAt: new Date(),
      author: { name: 'You', avatar: null }
    }
    setComments(prev => [optimisticComment, ...prev])

    try {
      const { commentIdea } = await import('@/app/actions')
      await commentIdea(ideaId, commentText)
      
      // Replace optimistic comment with real one
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id))
      setComments(prev => [{
        ...optimisticComment,
        id: `real-${Date.now()}`
      }, ...prev.filter(c => c.id !== optimisticComment.id)])
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      // Remove optimistic comment on error
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id))
      setNewComment(commentText) // Restore comment text
      
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>
      
      {/* Add Comment Form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this idea..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.author.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {comment.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
