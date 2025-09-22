'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  BellOff, 
  Settings, 
  Check, 
  X, 
  MoreHorizontal,
  Mail,
  Smartphone,
  Monitor,
  Clock,
  Star,
  Heart,
  MessageCircle,
  Lightbulb,
  Plane,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'
import { 
  Notification, 
  NotificationPreferences,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  getNotificationStats
} from '@/lib/notifications'
import { useToastActions } from '@/components/ToastSystem'

interface SmartNotificationsProps {
  userId: string
  className?: string
}

export function SmartNotifications({ userId, className }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { success, error } = useToastActions()

  // Load notifications and preferences
  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [notificationsData, preferencesData, statsData] = await Promise.all([
        getUserNotifications(userId, 50),
        getNotificationPreferences(userId),
        getNotificationStats(userId)
      ])
      
      setNotifications(notificationsData)
      setPreferences(preferencesData)
      setStats(statsData)
      setUnreadCount(statsData.unread)
    } catch (err) {
      error('Failed to load notifications', 'Please try again later')
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      success('Notification marked as read')
    } catch (err) {
      error('Failed to mark notification as read')
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(userId)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      success('All notifications marked as read')
    } catch (err) {
      error('Failed to mark all notifications as read')
    }
  }

  // Update preferences
  const handleUpdatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!preferences) return

    try {
      const updatedPreferences = { ...preferences, ...newPreferences }
      await updateNotificationPreferences(userId, updatedPreferences)
      setPreferences(updatedPreferences)
      success('Notification preferences updated')
    } catch (err) {
      error('Failed to update preferences')
    }
  }

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_idea': return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case 'new_vote': return <Heart className="h-4 w-4 text-red-500" />
      case 'new_comment': return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'trip_promoted': return <Plane className="h-4 w-4 text-green-500" />
      case 'group_activity': return <Users className="h-4 w-4 text-purple-500" />
      case 'recommendation': return <Zap className="h-4 w-4 text-indigo-500" />
      case 'reminder': return <Clock className="h-4 w-4 text-orange-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Smart Notifications</h2>
            <p className="text-sm text-gray-600">
              {stats?.total || 0} total, {stats?.unread || 0} unread
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && preferences && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>
                  Customize how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="font-medium mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                      <Switch
                        checked={preferences.email}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ email: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Push Notifications</span>
                      </div>
                      <Switch
                        checked={preferences.push}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ push: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span>In-App</span>
                      </div>
                      <Switch
                        checked={preferences.inApp}
                        onCheckedChange={(checked) => 
                          handleUpdatePreferences({ inApp: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h4 className="font-medium mb-3">Notification Types</h4>
                  <div className="space-y-3">
                    {Object.entries(preferences.types).map(([type, enabled]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getNotificationIcon(type)}
                          <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => 
                            handleUpdatePreferences({
                              types: { ...preferences.types, [type]: checked }
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <h4 className="font-medium mb-3">Frequency</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['immediate', 'daily', 'weekly'].map((freq) => (
                      <Button
                        key={freq}
                        variant={preferences.frequency === freq ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdatePreferences({ frequency: freq as any })}
                        className="capitalize"
                      >
                        {freq}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BellOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`${!notification.read ? 'bg-blue-50 border-blue-200' : ''} hover:shadow-md transition-all duration-200`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {notification.actionUrl && notification.actionText && (
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = notification.actionUrl!}
                            >
                              {notification.actionText}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Stats Summary */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(((stats.total - stats.unread) / stats.total) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Read Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(stats.byType).length}
                </div>
                <div className="text-sm text-gray-600">Types</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
