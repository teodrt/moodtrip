import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    unsplashKey: process.env.UNSPLASH_ACCESS_KEY ? 'Found' : 'Not found',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('UNSPLASH'))
  })
}
