import { ModelCard } from '@/components/ModelCard'
import { connectToDatabase } from '@/lib/mongodb'
import Model3D from '@/models/Model'
import User from '@/models/User'
import Link from 'next/link'

async function getModels() {
  await connectToDatabase()
  
  // Limit to 12 models for faster initial load
  const models = await Model3D.find()
    .populate('uploader', 'username')
    .sort({ createdAt: -1 })
    .limit(12)
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
    createdAt: model.createdAt?.toISOString() || new Date().toISOString(),
  }))
}

export default async function HomePage() {
  const models = await getModels()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
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

      {/* Models Grid */}
      {models.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map((model) => (
            <ModelCard key={model._id} model={model} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No models yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Be the first to upload a 3D model to the gallery!
          </p>
          <Link href="/upload" className="btn-primary">
            Upload Model
          </Link>
        </div>
      )}
    </div>
  )
}


