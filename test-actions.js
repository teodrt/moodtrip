// Test script for server actions
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic query
    const userCount = await prisma.user.count()
    console.log(`✅ Users in database: ${userCount}`)
    
    const groupCount = await prisma.group.count()
    console.log(`✅ Groups in database: ${groupCount}`)
    
    const ideaCount = await prisma.idea.count()
    console.log(`✅ Ideas in database: ${ideaCount}`)
    
    // Test creating a new idea
    console.log('🔍 Testing idea creation...')
    
    const group = await prisma.group.findFirst()
    if (!group) {
      throw new Error('No groups found in database')
    }
    
    const user = await prisma.user.findFirst()
    if (!user) {
      throw new Error('No users found in database')
    }
    
    const newIdea = await prisma.idea.create({
      data: {
        groupId: group.id,
        authorId: user.id,
        title: 'Test Idea from Script',
        prompt: 'This is a test idea created by the test script',
        budgetLevel: 'MEDIUM',
        monthHint: 7,
        status: 'PUBLISHED',
        tags: ['test', 'script'],
        palette: ['#FF0000', '#00FF00', '#0000FF'],
        summary: 'This is a test idea for verification purposes'
      }
    })
    
    console.log(`✅ Created test idea: ${newIdea.id}`)
    
    // Clean up test idea
    await prisma.idea.delete({
      where: { id: newIdea.id }
    })
    
    console.log('✅ Test idea cleaned up')
    
    console.log('🎉 All database tests passed!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()
