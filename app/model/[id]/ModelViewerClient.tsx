'use client'

import Link from 'next/link'
import { ModelViewer } from '@/components/ModelViewer'
import { ModelCardData } from '@/types'

interface ModelViewerClientProps {
  model: ModelCardData
}

export function ModelViewerClient({ model }: ModelViewerClientProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent transition-colors mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3D Viewer */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <ModelViewer
              url={model.fileUrl}
              className="aspect-video md:aspect-[16/10] w-full"
            />
          </div>
        </div>

        {/* Model Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h1 className="text-2xl font-bold mb-2">{model.name}</h1>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
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
              <span>{formatDate(model.createdAt)}</span>
            </div>

            {model.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {model.description}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Vertices
                </p>
                <p className="text-lg font-semibold text-accent">
                  {model.vertexCount.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                  File Size
                </p>
                <p className="text-lg font-semibold">
                  {formatFileSize(model.fileSize)}
                </p>
              </div>
            </div>
          </div>

          {/* Download / Actions */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Actions</h3>
            <div className="space-y-3">
              <a
                href={model.fileUrl}
                download
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download Model
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
                Share Link
              </button>
            </div>
          </div>

          {/* Controls Help */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Controls</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">
                  Left Click + Drag
                </kbd>
                <span>Rotate</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">
                  Right Click + Drag
                </kbd>
                <span>Pan</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">
                  Scroll
                </kbd>
                <span>Zoom</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


