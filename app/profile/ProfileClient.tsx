'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ModelCardData } from '@/types'

interface ProfileClientProps {
  user: {
    name: string
    email: string
  }
  models: ModelCardData[]
}

export function ProfileClient({ user, models: initialModels }: ProfileClientProps) {
  const router = useRouter()
  const [models, setModels] = useState(initialModels)
  const [editingModel, setEditingModel] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

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

  const handleEdit = (model: ModelCardData) => {
    setEditingModel(model._id)
    setEditForm({ name: model.name, description: model.description })
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingModel(null)
    setEditForm({ name: '', description: '' })
    setError('')
  }

  const handleSaveEdit = async (modelId: string) => {
    setLoading(modelId)
    setError('')

    try {
      const res = await fetch(`/api/models/${modelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update model')
      }

      // Update local state
      setModels(models.map(m => 
        m._id === modelId 
          ? { ...m, name: editForm.name, description: editForm.description }
          : m
      ))

      setEditingModel(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update model')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (modelId: string, modelName: string) => {
    if (!confirm(`Are you sure you want to delete "${modelName}"? This action cannot be undone.`)) {
      return
    }

    setLoading(modelId)
    setError('')

    try {
      const res = await fetch(`/api/models/${modelId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete model')
      }

      // Remove from local state
      setModels(models.filter(m => m._id !== modelId))
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to delete model')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-accent"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {models.length} {models.length === 1 ? 'model' : 'models'} uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Models Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Models</h2>
        <Link href="/upload" className="btn-primary">
          <span className="flex items-center gap-2">
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Upload New
          </span>
        </Link>
      </div>

      {/* Models List */}
      {models.length > 0 ? (
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model._id} className="glass-card p-6">
              {editingModel === model._id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Model Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      className="input-field resize-none"
                      rows={3}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      maxLength={500}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(model._id)}
                      disabled={loading === model._id}
                      className="btn-primary disabled:opacity-50"
                    >
                      {loading === model._id ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading === model._id}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-start gap-4">
                  {/* Model Preview */}
                  <Link 
                    href={`/model/${model._id}`}
                    className="flex-shrink-0 w-32 h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-12 h-12 text-accent"
                    >
                      <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
                    </svg>
                  </Link>

                  {/* Model Info */}
                  <div className="flex-grow">
                    <Link href={`/model/${model._id}`}>
                      <h3 className="text-xl font-semibold hover:text-accent transition-colors">
                        {model.name}
                      </h3>
                    </Link>
                    {model.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {model.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>{model.vertexCount.toLocaleString()} vertices</span>
                      <span>•</span>
                      <span>{formatFileSize(model.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(model.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/model/${model._id}`}
                      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                      title="View model"
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
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleEdit(model)}
                      disabled={loading === model._id}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                      title="Edit model"
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(model._id, model.name)}
                      disabled={loading === model._id}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                      title="Delete model"
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
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
            Upload your first 3D model to get started!
          </p>
          <Link href="/upload" className="btn-primary">
            Upload Model
          </Link>
        </div>
      )}
    </div>
  )
}

