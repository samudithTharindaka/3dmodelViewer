import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectToDatabase()

    const model = await Model3D.findById(id)
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
      uploaderId: (model as any).uploader?._id?.toString() || '',
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, description } = body

    await connectToDatabase()

    const model = await Model3D.findById(id)

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Check if user owns this model
    if (model.uploader.toString() !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'You can only edit your own models' },
        { status: 403 }
      )
    }

    // Update model
    model.name = name || model.name
    model.description = description !== undefined ? description : model.description
    await model.save()

    return NextResponse.json({
      message: 'Model updated successfully',
      model: {
        _id: model._id.toString(),
        name: model.name,
        description: model.description,
      }
    })
  } catch (error) {
    console.error('Error updating model:', error)
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await connectToDatabase()

    const model = await Model3D.findById(id)

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Check if user owns this model
    if (model.uploader.toString() !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'You can only delete your own models' },
        { status: 403 }
      )
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(model.publicId)
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await Model3D.findByIdAndDelete(id)

    return NextResponse.json({
      message: 'Model deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting model:', error)
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    )
  }
}
