import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UploadForm } from '@/components/UploadForm'

export default async function UploadPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload 3D Model</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Share your 3D creation with the community
        </p>
      </div>
      
      <div className="glass-card p-6">
        <UploadForm />
      </div>
    </div>
  )
}


