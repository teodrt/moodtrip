import { z } from 'zod'

// Input validation schemas
export const createIdeaSchema = z.object({
  groupSlug: z.string().min(1, 'Group slug is required').max(50, 'Group slug too long'),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(500, 'Prompt too long'),
  budget: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  kids: z.boolean().optional(),
  month: z.number().int().min(1).max(12).optional()
})

export const voteIdeaSchema = z.object({
  ideaId: z.string().min(1, 'Idea ID is required'),
  voteType: z.enum(['UP', 'MAYBE', 'DOWN'])
})

export const commentIdeaSchema = z.object({
  ideaId: z.string().min(1, 'Idea ID is required'),
  body: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment too long')
})

export const updateAvailabilitySchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
  month: z.number().int().min(1).max(12),
  score: z.number().int().min(0).max(100)
})

// Type exports
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>
export type VoteIdeaInput = z.infer<typeof voteIdeaSchema>
export type CommentIdeaInput = z.infer<typeof commentIdeaSchema>
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Safely handle the error.errors array
      const errorMessages = error.errors?.map(err => `${err.path.join('.')}: ${err.message}`).join(', ') || 'Unknown validation error'
      throw new Error(`Validation error: ${errorMessages}`)
    }
    throw error
  }
}
