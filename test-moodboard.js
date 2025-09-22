// Simple test script to verify generateMoodboard function
const { generateMoodboard } = require('./src/app/actions.ts');

async function testMoodboard() {
  try {
    console.log('Testing generateMoodboard function...');
    await generateMoodboard('test-idea-id');
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMoodboard();
