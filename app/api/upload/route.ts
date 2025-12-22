import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const vertexCount = parseInt(formData.get('vertexCount') as string) || 0

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const validExtensions = ['.glb', '.gltf']
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    
    if (!validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only GLB and GLTF files are allowed.' },
        { status: 400 }
      )
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { url, publicId } = await uploadToCloudinary(buffer, file.name)

    await connectToDatabase()

    const model = await Model3D.create({
      name: name || file.name.replace(/\.[^/.]+$/, ''),
      description: description || '',
      fileUrl: url,
      publicId,
      uploader: (session.user as any).id,
      vertexCount,
      fileSize: file.size,
    })

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
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload model' },
      { status: 500 }
    )
  }
}


