'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Loader2 } from 'lucide-react'
import { createTask } from '@/app/actions'

interface Task {
  id: string
  title: string
  status: 'TODO' | 'DOING' | 'DONE'
  owner: {
    name: string
    avatar: string | null
  } | null
  createdAt: Date
}

interface AddTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onTaskAdded: (task: Task) => void
  tripId: string
}

export function AddTaskDialog({ isOpen, onClose, onTaskAdded }: AddTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<'TODO' | 'DOING' | 'DONE'>('TODO')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const newTask = await createTask(tripId, title.trim(), status)
      onTaskAdded(newTask)
      
      // Reset form
      setTitle('')
      setStatus('TODO')
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('')
      setStatus('TODO')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Add New Task
                    </CardTitle>
                    <CardDescription>
                      Create a new task for this trip
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Task Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={isSubmitting}
                      required
                      autoFocus
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value: 'TODO' | 'DOING' | 'DONE') => setStatus(value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODO">
                          <div className="flex items-center gap-2">
                            <span>📋</span>
                            <span>To Do</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="DOING">
                          <div className="flex items-center gap-2">
                            <span>🔄</span>
                            <span>Doing</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="DONE">
                          <div className="flex items-center gap-2">
                            <span>✅</span>
                            <span>Done</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!title.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Task
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
