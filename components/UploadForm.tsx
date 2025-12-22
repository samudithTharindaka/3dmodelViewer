'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

export function UploadForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [vertexCount, setVertexCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const processFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile)
    setName(selectedFile.name.replace(/\.[^/.]+$/, ''))
    
    // Create object URL for preview
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)

    // Extract vertex count
    try {
      const loader = new GLTFLoader()
      const arrayBuffer = await selectedFile.arrayBuffer()
      
      loader.parse(arrayBuffer, '', (gltf) => {
        let totalVertices = 0
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            const geometry = child.geometry
            if (geometry.index) {
              totalVertices += geometry.index.count
            } else if (geometry.attributes.position) {
              totalVertices += geometry.attributes.position.count
            }
          }
        })
        setVertexCount(totalVertices)
      }, (error) => {
        console.error('Error parsing model:', error)
      })
    } catch (err) {
      console.error('Error loading model:', err)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const ext = droppedFile.name.toLowerCase().slice(droppedFile.name.lastIndexOf('.'))
      if (['.glb', '.gltf'].includes(ext)) {
        processFile(droppedFile)
        setError('')
      } else {
        setError('Please upload a GLB or GLTF file')
      }
    }
  }, [processFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('vertexCount', vertexCount.toString())

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Non-JSON response:', text)
        throw new Error(`Server error: ${res.status} ${res.statusText}. Please check if you're logged in and try again.`)
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to upload model')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-accent bg-accent/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-accent'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {file ? (
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-accent/20 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)} • {vertexCount.toLocaleString()} vertices
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <p className="font-medium">Drop your 3D model here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse • GLB, GLTF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Model Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Model Name</label>
          <input
            type="text"
            required
            className="input-field"
            placeholder="Enter model name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Describe your 3D model..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description.length}/500 characters
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!file || loading}
        className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading...
          </span>
        ) : (
          'Upload Model'
        )}
      </button>
    </form>
  )
}


