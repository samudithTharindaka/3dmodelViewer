'use client'

import { useState } from 'react'
import { ModelType, LandType } from '@/types'

interface ModelFiltersProps {
  selectedType: ModelType | 'all'
  selectedLandType: LandType | 'all'
  onTypeChange: (type: ModelType | 'all') => void
  onLandTypeChange: (landType: LandType | 'all') => void
}

export function ModelFilters({
  selectedType,
  selectedLandType,
  onTypeChange,
  onLandTypeChange,
}: ModelFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="glass-card mb-8">
      {/* Filter Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
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
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          <span className="font-semibold">Filters</span>
          {(selectedType !== 'all' || selectedLandType !== 'all') && (
            <span className="px-2 py-0.5 text-xs bg-accent text-black rounded-full">
              Active
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Filter Content - Collapsible */}
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
        {/* Model Type Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Model Type</label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as ModelType | 'all')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="building">Building</option>
            <option value="asset">Asset</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Land Type Filter - Only show when Building is selected */}
        {selectedType === 'building' && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Land Type</label>
            <select
              value={selectedLandType}
              onChange={(e) => onLandTypeChange(e.target.value as LandType | 'all')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="all">All Land Types</option>
              <option value="plot">Plot</option>
              <option value="double-plot">Double Plot</option>
              <option value="block">Block</option>
              <option value="double-block">Double Block</option>
              <option value="super-block">Super Block</option>
            </select>
          </div>
        )}

            {/* Reset Button */}
            {(selectedType !== 'all' || selectedLandType !== 'all') && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    onTypeChange('all')
                    onLandTypeChange('all')
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

