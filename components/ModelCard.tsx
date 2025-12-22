'use client'

import Link from 'next/link'
import { ModelCardData } from '@/types'

interface ModelCardProps {
  model: ModelCardData
}

export function ModelCard({ model }: ModelCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Link href={`/model/${model._id}`} className="block group">
      <div className="glass-card overflow-hidden hover:scale-[1.02] transition-transform duration-300">
        {/* Preview */}
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 text-accent"
              >
                <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
              </svg>
            </div>
          </div>
          
          {/* Vertex count badge */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
            {model.vertexCount.toLocaleString()} verts
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate group-hover:text-accent transition-colors">
            {model.name}
          </h3>
          
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
              </svg>
              <span>{model.uploaderName}</span>
            </div>
            <span>•</span>
            <span>{formatFileSize(model.fileSize)}</span>
          </div>

          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {formatDate(model.createdAt)}
          </p>

          {model.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {model.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}


