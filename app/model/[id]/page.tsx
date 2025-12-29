import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'
import User from '@/models/User'
import { ModelViewerClient } from './ModelViewerClient'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getModel(id: string) {
  try {
    await connectToDatabase()
    
    const model = await Model3D.findById(id)
      .populate('uploader', 'username')
      .lean()

    if (!model) return null

    return {
      _id: (model as any)._id.toString(),
      name: (model as any).name,
      description: (model as any).description || '',
      fileUrl: (model as any).fileUrl,
      thumbnailUrl: (model as any).thumbnailUrl || '',
      uploaderName: (model as any).uploader?.username || 'Unknown',
      vertexCount: (model as any).vertexCount || 0,
      fileSize: (model as any).fileSize || 0,
      modelType: (model as any).modelType || 'other',
      landType: (model as any).landType || 'none',
      height: (model as any).height || 0,
      createdAt: (model as any).createdAt?.toISOString() || new Date().toISOString(),
    }
  } catch {
    return null
  }
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { id } = await params
  const model = await getModel(id)

  if (!model) {
    notFound()
  }

  return <ModelViewerClient model={model} />
}


