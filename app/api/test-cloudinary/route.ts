import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('Testing Cloudinary connection...')
  
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    
    const config = cloudinary.config()
    
    console.log('Cloudinary config:', {
      cloud_name: config.cloud_name,
      api_key: config.api_key ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    })
    
    // Try to ping Cloudinary API
    const result = await cloudinary.api.ping()
    
    console.log('Cloudinary ping successful:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful!',
      cloudName: config.cloud_name,
      pingResult: result,
    })
  } catch (error: any) {
    console.error('Cloudinary test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        http_code: error.http_code,
        message: error.message,
      },
      envVars: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
        api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
      }
    }, { status: 500 })
  }
}

