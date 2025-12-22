import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'

export async function GET() {
  try {
    await connectToDatabase()

    const models = await Model3D.find()
      .populate('uploader', 'username')
      .sort({ createdAt: -1 })
      .lean()

    const formattedModels = models.map((model: any) => ({
      _id: model._id.toString(),
      name: model.name,
      description: model.description,
      fileUrl: model.fileUrl,
      thumbnailUrl: model.thumbnailUrl,
      uploaderName: model.uploader?.username || 'Unknown',
      vertexCount: model.vertexCount,
      fileSize: model.fileSize,
      createdAt: model.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedModels)
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}


