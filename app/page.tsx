import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'
import User from '@/models/User'
import { GalleryClient } from './GalleryClient'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getModels() {
  try {
    await connectToDatabase()
    console.log('Connected to MongoDB');
    const models = await Model3D.find()
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
  } catch (error) {
    console.error('Error fetching models:', error)
    return []
  }
}

export default async function HomePage() {
  const models = await getModels()
  console.log('Available models:', JSON.stringify(models, null, 2));
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section - Only show when no models */}
      {models.length === 0 && (
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent to-blue-500 bg-clip-text text-transparent">
              3D Model Gallery
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover and share stunning 3D models. Upload your creations or explore
            works from artists around the world.
          </p>
        </div>
      )}

      {/* Gallery with Filters */}
      <GalleryClient initialModels={models} />
    </div>
  )
}


