'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Center, Grid, Html, useProgress } from '@react-three/drei'
import { Group, Mesh } from 'three'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {progress.toFixed(0)}% loaded
        </p>
      </div>
    </Html>
  )
}

interface ModelProps {
  url: string
  autoRotate: boolean
  onVertexCount?: (count: number) => void
}

function Model({ url, autoRotate, onVertexCount }: ModelProps) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<Group>(null)

  useEffect(() => {
    if (scene && onVertexCount) {
      let totalVertices = 0
      scene.traverse((child) => {
        if (child instanceof Mesh && child.geometry) {
          const geometry = child.geometry
          if (geometry.index) {
            totalVertices += geometry.index.count
          } else if (geometry.attributes.position) {
            totalVertices += geometry.attributes.position.count
          }
        }
      })
      onVertexCount(totalVertices)
    }
  }, [scene, onVertexCount])

  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <Center>
      <group ref={modelRef}>
        <primitive object={scene} />
      </group>
    </Center>
  )
}

function SceneSetup() {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.position.set(30, 30, 70)
  }, [camera])

  return null
}

interface ModelViewerProps {
  url: string
  className?: string
  showControls?: boolean
  autoRotateDefault?: boolean
  onVertexCount?: (count: number) => void
}

export function ModelViewer({ url, className = '', showControls = true, autoRotateDefault = true, onVertexCount }: ModelViewerProps) {
  const [autoRotate, setAutoRotate] = useState(autoRotateDefault)
  const [showGrid, setShowGrid] = useState(true)

  return (
    <div className={`relative ${className}`}>
      <Canvas
        shadows
        camera={{ position: [3, 2, 5], fov: 50 }}
        className="!bg-transparent"
      >
        <SceneSetup />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Suspense fallback={<Loader />}>
          <Model url={url} autoRotate={autoRotate} onVertexCount={onVertexCount} />
          <Environment preset="city" />
        </Suspense>

        {showGrid && (
          <Grid
            args={[20, 20]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#6f6f6f"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#00d4ff"
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />
        )}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.5}
          maxDistance={100}
        />
      </Canvas>

      {showControls && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-colors ${
              autoRotate
                ? 'bg-accent text-black'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            title={autoRotate ? 'Stop rotation' : 'Auto rotate'}
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
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid
                ? 'bg-accent text-black'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            title={showGrid ? 'Hide grid' : 'Show grid'}
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
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}


