const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null
    }
  })

  // Create a test group
  const group = await prisma.group.upsert({
    where: { slug: 'family' },
    update: {},
    create: {
      name: 'Family',
      slug: 'family'
    }
  })

  // Create a test idea
  const idea = await prisma.idea.upsert({
    where: { id: 'test-idea-1' },
    update: {},
    create: {
      id: 'test-idea-1',
      groupId: group.id,
      authorId: user.id,
      title: 'Beach Getaway in Maldives',
      prompt: 'A serene beach getaway in the Maldives with overwater bungalows and snorkeling',
      tags: ['beach', 'luxury', 'relaxation'],
      budgetLevel: 'HIGH',
      monthHint: 6, // June
      status: 'PUBLISHED',
      palette: ['#87CEEB', '#F0E68C', '#98FB98', '#FFB6C1', '#DDA0DD'],
      summary: 'A luxurious beach escape perfect for families, featuring crystal-clear waters and world-class snorkeling opportunities.'
    }
  })

  // Create some test images
  await prisma.image.createMany({
    data: [
      {
        ideaId: idea.id,
        url: '/placeholder-image.svg',
        source: 'STOCK',
        provider: 'Unsplash',
        order: 0
      },
      {
        ideaId: idea.id,
        url: '/placeholder-image.svg',
        source: 'STOCK',
        provider: 'Unsplash',
        order: 1
      }
    ]
  })

  // Create a test vote
  await prisma.vote.upsert({
    where: {
      ideaId_userId: {
        ideaId: idea.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      ideaId: idea.id,
      userId: user.id,
      value: 'UP'
    }
  })

  // Create some test comments
  await prisma.comment.createMany({
    data: [
      {
        ideaId: idea.id,
        authorId: user.id,
        body: 'This looks amazing! Perfect for our summer vacation.'
      },
      {
        ideaId: idea.id,
        authorId: user.id,
        body: 'The overwater bungalows are so romantic!'
      }
    ]
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 User: ${user.email}`)
  console.log(`👥 Group: ${group.name}`)
  console.log(`💡 Idea: ${idea.title}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
