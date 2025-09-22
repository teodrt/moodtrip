const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCreateIdea() {
  try {
    console.log('🧪 Testing idea creation...')
    
    // Find the group by slug
    const group = await prisma.group.findUnique({
      where: { slug: 'family' }
    })
    
    if (!group) {
      throw new Error('Group with slug "family" not found')
    }
    
    console.log('✅ Group found:', group)
    
    // Get user ID
    const userId = 'cmfva3td500006ermy5186aw7'
    
    // Create the idea
    const idea = await prisma.idea.create({
      data: {
        title: 'Test idea from script',
        prompt: 'A test idea created from script',
        groupId: group.id,
        authorId: userId,
        budgetLevel: 'MEDIUM',
        monthHint: 6,
        status: 'DRAFT',
        tags: [],
        palette: undefined,
        summary: undefined
      }
    })
    
    console.log('✅ Idea created successfully:', idea)
    
  } catch (error) {
    console.error('❌ Error creating idea:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCreateIdea()
