import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('TEST: GET request received')
  return NextResponse.json({
    message: 'GET request received',
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  console.log('TEST: POST request received')
  
  try {
    const body = await request.text()
    return NextResponse.json({
      message: 'POST request received successfully!',
      method: request.method,
      url: request.url,
      bodyLength: body.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      method: request.method,
    }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  console.log('TEST: OPTIONS request received')
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

