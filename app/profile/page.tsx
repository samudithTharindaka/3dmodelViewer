import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'
import User from '@/models/User'
import { ProfileClient } from './ProfileClient'

async function getUserModels(userId: string) {
  await connectToDatabase()
  
  const models = await Model3D.find({ uploader: userId })
    .populate('uploader', 'username')
    .sort({ createdAt: -1 })
    .lean()

  return models.map((model: any) => ({
    _id: model._id.toString(),
    name: model.name,
    description: model.description || '',
    fileUrl: model.fileUrl,
    thumbnailUrl: model.thumbnailUrl || '',
    uploaderName: model.uploader?.username || 'Unknown',
    vertexCount: model.vertexCount || 0,
    fileSize: model.fileSize || 0,
    modelType: model.modelType || 'other',
    landType: model.landType || 'none',
    height: model.height || 0,
    createdAt: model.createdAt?.toISOString() || new Date().toISOString(),
  }))
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const models = await getUserModels((session.user as any).id)

  return (
    <ProfileClient 
      user={{
        name: session.user?.name || '',
        email: session.user?.email || '',
      }}
      models={models}
    />
  )
}

