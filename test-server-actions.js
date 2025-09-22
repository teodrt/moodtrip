// Test server actions directly
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Simulate the createIdea function
async function testCreateIdea() {
  try {
    console.log('🔍 Testing createIdea server action...')
    
    // Get test data
    const group = await prisma.group.findFirst()
    const user = await prisma.user.findFirst()
    
    if (!group || !user) {
      throw new Error('Missing test data')
    }
    
    // Simulate createIdea input
    const input = {
      groupSlug: group.slug,
      prompt: 'A beautiful mountain retreat with hiking trails and hot springs',
      budget: 'MEDIUM',
      kids: false,
      month: 8
    }
    
    console.log('📝 Creating idea with input:', input)
    
    // Create the idea (simulating the server action)
    const idea = await prisma.idea.create({
      data: {
        groupId: group.id,
        authorId: user.id,
        title: input.prompt.substring(0, 100),
        prompt: input.prompt,
        budgetLevel: input.budget,
        monthHint: input.month,
        status: 'DRAFT'
      }
    })
    
    console.log(`✅ Idea created successfully: ${idea.id}`)
    console.log(`   Title: ${idea.title}`)
    console.log(`   Status: ${idea.status}`)
    console.log(`   Budget: ${idea.budgetLevel}`)
    console.log(`   Month: ${idea.monthHint}`)
    
    // Test voting
    console.log('🔍 Testing vote functionality...')
    const vote = await prisma.vote.create({
      data: {
        ideaId: idea.id,
        userId: user.id,
        value: 'UP'
      }
    })
    console.log(`✅ Vote created: ${vote.value}`)
    
    // Test commenting
    console.log('🔍 Testing comment functionality...')
    const comment = await prisma.comment.create({
      data: {
        ideaId: idea.id,
        authorId: user.id,
        body: 'This looks amazing! Perfect for our summer vacation.'
      }
    })
    console.log(`✅ Comment created: ${comment.body.substring(0, 50)}...`)
    
    // Clean up
    await prisma.vote.deleteMany({ where: { ideaId: idea.id } })
    await prisma.comment.deleteMany({ where: { ideaId: idea.id } })
    await prisma.idea.delete({ where: { id: idea.id } })
    
    console.log('✅ Test data cleaned up')
    console.log('🎉 All server action tests passed!')
    
  } catch (error) {
    console.error('❌ Server action test failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testCreateIdea()
