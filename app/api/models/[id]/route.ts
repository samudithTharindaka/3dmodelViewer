import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const model = await Model3D.findById(params.id)
      .populate('uploader', 'username')
      .lean()

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    const formattedModel = {
      _id: (model as any)._id.toString(),
      name: (model as any).name,
      description: (model as any).description,
      fileUrl: (model as any).fileUrl,
      thumbnailUrl: (model as any).thumbnailUrl,
      uploaderName: (model as any).uploader?.username || 'Unknown',
      vertexCount: (model as any).vertexCount,
      fileSize: (model as any).fileSize,
      createdAt: (model as any).createdAt.toISOString(),
    }

    return NextResponse.json(formattedModel)
  } catch (error) {
    console.error('Error fetching model:', error)
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    )
  }
}


