'use client'

interface NotificationData {
  title: string
  body: string
  icon?: string
  tag?: string
  data?: Record<string, any>
}

class NotificationManager {
  private permission: NotificationPermission = 'default'
  private isSupported: boolean = false

  constructor() {
    this.isSupported = 'Notification' in window
    this.permission = this.isSupported ? Notification.permission : 'denied'
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) return false
    if (this.permission === 'granted') return true

    try {
      this.permission = await Notification.requestPermission()
      return this.permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  async showNotification(data: NotificationData): Promise<Notification | null> {
    if (!this.isSupported || this.permission !== 'granted') return null

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/icon-192x192.svg',
        tag: data.tag,
        data: data.data
      })

      setTimeout(() => notification.close(), 5000)
      return notification
    } catch (error) {
      console.error('Error showing notification:', error)
      return null
    }
  }

  async notifyNewIdea(ideaTitle: string, authorName: string) {
    return this.showNotification({
      title: 'New Idea Added',
      body: `${authorName} added "${ideaTitle}"`,
      tag: 'new-idea'
    })
  }

  async notifyVoteUpdate(ideaTitle: string, voteType: string, voterName: string) {
    const voteEmoji = { 'UP': '👍', 'MAYBE': '🤔', 'DOWN': '👎' }[voteType] || '🗳️'
    return this.showNotification({
      title: 'Vote Cast',
      body: `${voterName} voted ${voteEmoji} on "${ideaTitle}"`,
      tag: 'vote-updated'
    })
  }

  async notifyMoodboardReady(ideaTitle: string) {
    return this.showNotification({
      title: 'Moodboard Ready!',
      body: `Your moodboard for "${ideaTitle}" is ready`,
      tag: 'moodboard-ready'
    })
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission
  }

  isNotificationSupported(): boolean {
    return this.isSupported
  }
}

export const notificationManager = new NotificationManager()