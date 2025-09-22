import { prisma } from './prisma'

export interface NotificationPreferences {
  userId: string
  email: boolean
  push: boolean
  inApp: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
  types: {
    newIdea: boolean
    newVote: boolean
    newComment: boolean
    tripPromoted: boolean
    groupActivity: boolean
    recommendations: boolean
    reminders: boolean
  }
}

export interface Notification {
  id: string
  userId: string
  type: 'new_idea' | 'new_vote' | 'new_comment' | 'trip_promoted' | 'group_activity' | 'recommendation' | 'reminder'
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: Date
  expiresAt?: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  actionText?: string
}

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

/**
 * Creates a new notification
 */
export async function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  data?: any,
  priority: Notification['priority'] = 'medium',
  actionUrl?: string,
  actionText?: string,
  expiresAt?: Date
): Promise<Notification> {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
        priority,
        actionUrl,
        actionText,
        expiresAt,
        read: false
      }
    })

    // Send push notification if enabled
    await sendPushNotification(userId, {
      title,
      body: message,
      data: { notificationId: notification.id, type, actionUrl }
    })

    return {
      ...notification,
      data: data
    }
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

/**
 * Sends push notification to user
 */
export async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload
): Promise<void> {
  try {
    // Get user's push subscription
    const subscription = await prisma.pushSubscription.findFirst({
      where: { userId }
    })

    if (!subscription) {
      console.log('No push subscription found for user:', userId)
      return
    }

    // Send push notification using web push
    const webpush = require('web-push')
    
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:admin@moodtrip.com',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    )

    await webpush.sendNotification(
      JSON.parse(subscription.subscription),
      JSON.stringify(payload)
    )

    console.log('Push notification sent to user:', userId)
  } catch (error) {
    console.error('Error sending push notification:', error)
    // Don't throw error to avoid breaking the main flow
  }
}

/**
 * Gets user's notifications
 */
export async function getUserNotifications(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Notification[]> {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    return notifications.map(notification => ({
      ...notification,
      data: notification.data ? JSON.parse(notification.data) : null
    }))
  } catch (error) {
    console.error('Error getting user notifications:', error)
    return []
  }
}

/**
 * Marks notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

/**
 * Marks all notifications as read for user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

/**
 * Gets notification preferences for user
 */
export async function getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
  try {
    const preferences = await prisma.notificationPreferences.findUnique({
      where: { userId }
    })

    if (!preferences) {
      // Return default preferences
      return {
        userId,
        email: true,
        push: true,
        inApp: true,
        frequency: 'immediate',
        types: {
          newIdea: true,
          newVote: true,
          newComment: true,
          tripPromoted: true,
          groupActivity: true,
          recommendations: true,
          reminders: true
        }
      }
    }

    return {
      userId: preferences.userId,
      email: preferences.email,
      push: preferences.push,
      inApp: preferences.inApp,
      frequency: preferences.frequency as any,
      types: {
        newIdea: preferences.newIdea,
        newVote: preferences.newVote,
        newComment: preferences.newComment,
        tripPromoted: preferences.tripPromoted,
        groupActivity: preferences.groupActivity,
        recommendations: preferences.recommendations,
        reminders: preferences.reminders
      }
    }
  } catch (error) {
    console.error('Error getting notification preferences:', error)
    return null
  }
}

/**
 * Updates notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  try {
    await prisma.notificationPreferences.upsert({
      where: { userId },
      update: {
        email: preferences.email,
        push: preferences.push,
        inApp: preferences.inApp,
        frequency: preferences.frequency,
        newIdea: preferences.types?.newIdea,
        newVote: preferences.types?.newVote,
        newComment: preferences.types?.newComment,
        tripPromoted: preferences.types?.tripPromoted,
        groupActivity: preferences.types?.groupActivity,
        recommendations: preferences.types?.recommendations,
        reminders: preferences.types?.reminders
      },
      create: {
        userId,
        email: preferences.email ?? true,
        push: preferences.push ?? true,
        inApp: preferences.inApp ?? true,
        frequency: preferences.frequency ?? 'immediate',
        newIdea: preferences.types?.newIdea ?? true,
        newVote: preferences.types?.newVote ?? true,
        newComment: preferences.types?.newComment ?? true,
        tripPromoted: preferences.types?.tripPromoted ?? true,
        groupActivity: preferences.types?.groupActivity ?? true,
        recommendations: preferences.types?.recommendations ?? true,
        reminders: preferences.types?.reminders ?? true
      }
    })
  } catch (error) {
    console.error('Error updating notification preferences:', error)
    throw error
  }
}

/**
 * Saves push subscription
 */
export async function savePushSubscription(
  userId: string,
  subscription: any
): Promise<void> {
  try {
    await prisma.pushSubscription.upsert({
      where: { userId },
      update: { subscription: JSON.stringify(subscription) },
      create: {
        userId,
        subscription: JSON.stringify(subscription)
      }
    })
  } catch (error) {
    console.error('Error saving push subscription:', error)
    throw error
  }
}

/**
 * Sends notification to group members
 */
export async function notifyGroupMembers(
  groupId: string,
  type: Notification['type'],
  title: string,
  message: string,
  data?: any,
  excludeUserId?: string
): Promise<void> {
  try {
    // Get group members
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    })

    if (!group) return

    // Send notification to each member
    for (const member of group.members) {
      if (excludeUserId && member.userId === excludeUserId) continue

      // Check user's notification preferences
      const preferences = await getNotificationPreferences(member.userId)
      if (!preferences || !preferences.types[type as keyof typeof preferences.types]) continue

      await createNotification(
        member.userId,
        type,
        title,
        message,
        data,
        'medium',
        `/g/${group.slug}`,
        'View Group'
      )
    }
  } catch (error) {
    console.error('Error notifying group members:', error)
  }
}

/**
 * Sends reminder notifications
 */
export async function sendReminderNotifications(): Promise<void> {
  try {
    // Get users who haven't been active in the last 7 days
    const inactiveUsers = await prisma.user.findMany({
      where: {
        lastActiveAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    for (const user of inactiveUsers) {
      await createNotification(
        user.id,
        'reminder',
        'We miss you!',
        'Come back and check out the latest travel ideas in your groups.',
        null,
        'low',
        '/',
        'Visit App'
      )
    }

    // Get groups with no activity in the last 3 days
    const inactiveGroups = await prisma.group.findMany({
      where: {
        updatedAt: {
          lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    })

    for (const group of inactiveGroups) {
      await notifyGroupMembers(
        group.id,
        'reminder',
        'Group Activity Reminder',
        `The ${group.name} group hasn't had any new ideas recently. Why not share a new travel idea?`,
        { groupId: group.id, groupName: group.name }
      )
    }
  } catch (error) {
    console.error('Error sending reminder notifications:', error)
  }
}

/**
 * Cleans up expired notifications
 */
export async function cleanupExpiredNotifications(): Promise<void> {
  try {
    await prisma.notification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  } catch (error) {
    console.error('Error cleaning up expired notifications:', error)
  }
}

/**
 * Gets notification statistics
 */
export async function getNotificationStats(userId: string): Promise<{
  total: number
  unread: number
  byType: Record<string, number>
  byPriority: Record<string, number>
}> {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId }
    })

    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>
    }

    // Count by type
    for (const notification of notifications) {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1
      stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1
    }

    return stats
  } catch (error) {
    console.error('Error getting notification stats:', error)
    return {
      total: 0,
      unread: 0,
      byType: {},
      byPriority: {}
    }
  }
}
