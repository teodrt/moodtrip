const { auth } = require('./src/lib/auth.ts')

async function testAuth() {
  try {
    console.log('🧪 Testing auth import...')
    const session = await auth()
    console.log('✅ Auth session:', session)
  } catch (error) {
    console.error('❌ Auth error:', error)
  }
}

testAuth()
