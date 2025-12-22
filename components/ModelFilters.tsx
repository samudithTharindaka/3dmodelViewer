'use client'

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
  return (
    <div className="glass-card p-4 mb-8">
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
  )
}

