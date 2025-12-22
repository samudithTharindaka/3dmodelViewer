'use client'

import { useState, useMemo } from 'react'
import { ModelCard } from '@/components/ModelCard'
import { ModelFilters } from '@/components/ModelFilters'
import { ModelCardData, ModelType, LandType } from '@/types'
import Link from 'next/link'

interface GalleryClientProps {
  initialModels: ModelCardData[]
}

export function GalleryClient({ initialModels }: GalleryClientProps) {
  const [selectedType, setSelectedType] = useState<ModelType | 'all'>('all')
  const [selectedLandType, setSelectedLandType] = useState<LandType | 'all'>('all')
  const [selectedUploader, setSelectedUploader] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Get unique uploaders
  const uploaders = useMemo(() => {
    const uniqueUploaders = new Set(initialModels.map(model => model.uploaderName))
    return Array.from(uniqueUploaders).sort()
  }, [initialModels])

  const filteredModels = useMemo(() => {
    return initialModels.filter((model) => {
      // Filter by search query
      if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Filter by uploader
      if (selectedUploader !== 'all' && model.uploaderName !== selectedUploader) {
        return false
      }

      // Filter by model type
      if (selectedType !== 'all' && model.modelType !== selectedType) {
        return false
      }

      // Filter by land type (only for buildings)
      if (selectedType === 'building' && selectedLandType !== 'all') {
        if (model.landType !== selectedLandType) {
          return false
        }
      }

      return true
    })
  }, [initialModels, selectedType, selectedLandType, selectedUploader, searchQuery])

  return (
    <>
      <ModelFilters
        selectedType={selectedType}
        selectedLandType={selectedLandType}
        selectedUploader={selectedUploader}
        searchQuery={searchQuery}
        uploaders={uploaders}
        onTypeChange={setSelectedType}
        onLandTypeChange={setSelectedLandType}
        onUploaderChange={setSelectedUploader}
        onSearchChange={setSearchQuery}
      />

      {filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No models found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your filters or upload a new model!
          </p>
          <Link href="/upload" className="btn-primary">
            Upload Model
          </Link>
        </div>
      )}
    </>
  )
}

