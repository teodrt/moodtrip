'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ArrowLeft, Calendar, Users, CheckCircle, Clock, Play, Pause, MoreHorizontal, Edit, Trash2, Star, Flag, Zap, Target, TrendingUp, BarChart3 } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with sophisticated movement */}
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 25, -15, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -15, 25, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />

        {/* Floating particles */}
        <motion.div 
          className="absolute top-20 left-20 w-3 h-3 bg-white/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-32 w-4 h-4 bg-purple-400/30 rounded-full"
          animate={{
            y: [0, -25, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-2 h-2 bg-pink-400/40 rounded-full"
          animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <Link
            href={`/g/${trip.group.slug}`}
            className="inline-flex items-center text-sm text-white/60 hover:text-white/80 transition-colors mb-6 group"
          >
            <motion.div
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </motion.div>
            Back to {trip.group.name}
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-5xl font-display text-white mb-4 text-balance">
                  {trip.title}
                </h1>
                <p className="text-xl text-white/70 mb-6 text-balance">
                  {trip.idea.title}
                </p>
              </motion.div>

              {/* Premium Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Created</p>
                      <p className="text-white font-medium">{formatDate(trip.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Group</p>
                      <p className="text-white font-medium">{trip.group.name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Progress</p>
                      <p className="text-white font-medium">
                        {Math.round((getTasksByStatus('DONE').length / tasks.length) * 100) || 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Task
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {(['TODO', 'DOING', 'DONE'] as const).map((status, columnIndex) => {
            const statusTasks = getTasksByStatus(status)
            const statusConfig = {
              TODO: { 
                icon: <Clock className="h-5 w-5" />, 
                color: 'from-gray-500 to-gray-600', 
                bgColor: 'bg-gray-500/10',
                borderColor: 'border-gray-500/20',
                textColor: 'text-gray-400'
              },
              DOING: { 
                icon: <Play className="h-5 w-5" />, 
                color: 'from-blue-500 to-blue-600', 
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/20',
                textColor: 'text-blue-400'
              },
              DONE: { 
                icon: <CheckCircle className="h-5 w-5" />, 
                color: 'from-green-500 to-green-600', 
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/20',
                textColor: 'text-green-400'
              }
            }
            const config = statusConfig[status]
            
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * columnIndex }}
                className="space-y-6"
              >
                {/* Premium Column Header */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${config.bgColor} rounded-2xl flex items-center justify-center ${config.borderColor} border`}>
                        {config.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-display text-white capitalize">
                          {status === 'TODO' ? 'To Do' : status === 'DOING' ? 'In Progress' : 'Completed'}
                        </h2>
                        <p className={`text-sm ${config.textColor}`}>
                          {statusTasks.length} {statusTasks.length === 1 ? 'task' : 'tasks'}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${config.bgColor} ${config.textColor} border ${config.borderColor} px-3 py-1 rounded-xl`}>
                      {statusTasks.length}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className={`h-2 bg-gradient-to-r ${config.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(statusTasks.length / Math.max(tasks.length, 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + columnIndex * 0.2 }}
                    />
                  </div>
                </div>

                {/* Tasks Container */}
                <div className="space-y-4 min-h-[500px]">
                  <AnimatePresence mode="popLayout">
                    {statusTasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-16"
                      >
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center">
                            {config.icon}
                          </div>
                          <h3 className="text-lg font-medium text-white/80 mb-2">No tasks yet</h3>
                          <p className="text-white/60 text-sm">
                            {status === 'TODO' ? 'Add your first task to get started' : 
                             status === 'DOING' ? 'Move tasks here when you start working' : 
                             'Completed tasks will appear here'}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      statusTasks.map((task, taskIndex) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: taskIndex * 0.05 }}
                          whileHover={{ y: -2, scale: 1.02 }}
                          className="group"
                        >
                          <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 hover:border-white/30 transition-all duration-300 rounded-2xl overflow-hidden">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                {/* Task Header */}
                                <div className="flex items-start justify-between">
                                  <h3 className="font-medium text-white line-clamp-2 group-hover:text-white/90 transition-colors">
                                    {task.title}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-white/40 hover:text-white/60 hover:bg-white/10 rounded-xl"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Task Owner */}
                                {task.owner && (
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 border-2 border-white/20">
                                      <AvatarImage src={task.owner.avatar || undefined} />
                                      <AvatarFallback className="text-xs bg-white/10 text-white">
                                        {task.owner.name.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm text-white/80 font-medium">{task.owner.name}</p>
                                      <p className="text-xs text-white/60">Assigned</p>
                                    </div>
                                  </div>
                                )}

                                {/* Status Selector */}
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-white/60">Status:</span>
                                  <Select
                                    value={task.status}
                                    onValueChange={(value: 'TODO' | 'DOING' | 'DONE') => 
                                      handleStatusChange(task.id, value)
                                    }
                                    disabled={isUpdating === task.id}
                                  >
                                    <SelectTrigger className="h-9 bg-white/10 border-white/20 text-white rounded-xl">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                      <SelectItem value="TODO" className="text-white">
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4" />
                                          <span>To Do</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="DOING" className="text-white">
                                        <div className="flex items-center gap-2">
                                          <Play className="h-4 w-4" />
                                          <span>In Progress</span>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="DONE" className="text-white">
                                        <div className="flex items-center gap-2">
                                          <CheckCircle className="h-4 w-4" />
                                          <span>Done</span>
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  {isUpdating === task.id && (
                                    <motion.div
                                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                  )}
                                </div>

                                {/* Task Actions */}
                                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg"
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg"
                                  >
                                    <Flag className="h-3 w-3 mr-1" />
                                    Priority
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

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
