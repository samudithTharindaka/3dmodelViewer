import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'

// Configure route for Vercel
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Add GET handler for debugging
export async function GET(request: NextRequest) {
  console.log('GET request received on /api/upload - this should be POST')
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to upload files.' },
    { status: 405 }
  )
}

export async function POST(request: NextRequest) {
  console.log('POST request received on /api/upload')
  
  try {
    console.log('Checking session...')
    const session = await getServerSession(authOptions)
    
    console.log('Session:', session ? `User: ${session.user?.email}` : 'No session')
    
    if (!session?.user) {
      console.error('Unauthorized: No session found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('User authenticated, processing upload...')

    console.log('Parsing form data...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const vertexCount = parseInt(formData.get('vertexCount') as string) || 0

    console.log('Form data parsed:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      name,
      vertexCount
    })

    if (!file) {
      console.error('No file in form data')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const validExtensions = ['.glb', '.gltf']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    console.log('Validating file:', { fileExtension })
    
    if (!validExtensions.includes(fileExtension)) {
      console.error('Invalid file type:', fileExtension)
      return NextResponse.json(
        { error: 'Invalid file type. Only GLB and GLTF files are allowed.' },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB (Vercel limit)
    if (file.size > maxSize) {
      console.error('File too large:', file.size)
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    console.log('Converting file to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('Uploading to Cloudinary...')
    const { url, publicId } = await uploadToCloudinary(buffer, file.name)
    console.log('Cloudinary upload successful:', { url, publicId })

    console.log('Connecting to database...')
    await connectToDatabase()

    console.log('Creating model record...')
    const model = await Model3D.create({
      name: name || file.name.replace(/\.[^/.]+$/, ''),
      description: description || '',
      fileUrl: url,
      publicId,
      uploader: (session.user as any).id,
      vertexCount,
      fileSize: file.size,
    })
    
    console.log('Model created successfully:', model._id)

    return NextResponse.json(
      { 
        message: 'Model uploaded successfully',
        model: {
          id: model._id,
          name: model.name,
          fileUrl: model.fileUrl,
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Upload error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { error: error.message || 'Failed to upload model' },
      { status: 500 }
    )
  }
}


