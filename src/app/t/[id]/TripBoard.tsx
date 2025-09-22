'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ArrowLeft, Calendar, Users } from "lucide-react"
import Link from "next/link"
import { AddTaskDialog } from "./AddTaskDialog"
import { updateTaskStatus } from "@/app/actions"
import { EmptyTripTasks } from "@/components/EmptyStates"

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

interface TripBoardProps {
  trip: {
    id: string
    title: string
    createdAt: Date
    idea: {
      title: string
      prompt: string
      coverImage: string
    }
    group: {
      slug: string
      name: string
    }
    tasks: Task[]
  }
}

export function TripBoard({ trip }: TripBoardProps) {
  const [tasks, setTasks] = useState(trip.tasks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = async (taskId: string, newStatus: 'TODO' | 'DOING' | 'DONE') => {
    setIsUpdating(taskId)
    
    // Optimistic update
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))

    try {
      await updateTaskStatus(taskId, newStatus)
    } catch (error) {
      console.error('Error updating task status:', error)
      // Revert optimistic update on error
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: trip.tasks.find(t => t.id === taskId)?.status || 'TODO' } : task
      ))
    } finally {
      setIsUpdating(null)
    }
  }

  const handleTaskAdded = (newTask: Task) => {
    setTasks(prev => [...prev, newTask])
  }

  const getTasksByStatus = (status: 'TODO' | 'DOING' | 'DONE') => {
    return tasks.filter(task => task.status === status)
  }

  const getStatusColor = (status: 'TODO' | 'DOING' | 'DONE') => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800'
      case 'DOING': return 'bg-blue-100 text-blue-800'
      case 'DONE': return 'bg-green-100 text-green-800'
    }
  }

  const getStatusIcon = (status: 'TODO' | 'DOING' | 'DONE') => {
    switch (status) {
      case 'TODO': return '📋'
      case 'DOING': return '🔄'
      case 'DONE': return '✅'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/g/${trip.group.slug}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {trip.group.name}
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {trip.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {trip.idea.title}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {formatDate(trip.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {trip.group.name}
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['TODO', 'DOING', 'DONE'] as const).map((status, columnIndex) => {
            const statusTasks = getTasksByStatus(status)
            
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
                className="space-y-4"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(status)}</span>
                    <h2 className="text-lg font-semibold text-gray-900 capitalize">
                      {status}
                    </h2>
                    <Badge className={getStatusColor(status)}>
                      {statusTasks.length}
                    </Badge>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3 min-h-[400px]">
                  {statusTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">{getStatusIcon(status)}</div>
                      <p className="text-sm">No tasks yet</p>
                    </div>
                  ) : (
                    statusTasks.map((task, taskIndex) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: taskIndex * 0.05 }}
                      >
                        <Card className="hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Task Title */}
                              <h3 className="font-medium text-gray-900 line-clamp-2">
                                {task.title}
                              </h3>

                              {/* Task Owner */}
                              {task.owner && (
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.owner.avatar || undefined} />
                                    <AvatarFallback className="text-xs">
                                      {task.owner.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-gray-600">
                                    {task.owner.name}
                                  </span>
                                </div>
                              )}

                              {/* Status Selector */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Status:</span>
                                <Select
                                  value={task.status}
                                  onValueChange={(value: 'TODO' | 'DOING' | 'DONE') => 
                                    handleStatusChange(task.id, value)
                                  }
                                  disabled={isUpdating === task.id}
                                >
                                  <SelectTrigger className="h-8 text-xs">
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
                                
                                {isUpdating === task.id && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Add Task Dialog */}
        <AddTaskDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onTaskAdded={handleTaskAdded}
          tripId={trip.id}
        />
      </div>
    </div>
  )
}
