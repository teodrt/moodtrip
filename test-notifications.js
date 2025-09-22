// Simple test script to verify notifications are working
const { onNewIdea, onPromoteTrip } = require('./src/lib/notify.ts')

async function testNotifications() {
  console.log('Testing notification service...\n')
  
  // Test new idea notification
  console.log('1. Testing onNewIdea...')
  await onNewIdea('test-group-id', 'test-idea-id')
  
  console.log('\n2. Testing onPromoteTrip...')
  await onPromoteTrip('test-group-id', 'test-trip-id')
  
  console.log('\n✅ Notification tests completed!')
}

testNotifications().catch(console.error)
