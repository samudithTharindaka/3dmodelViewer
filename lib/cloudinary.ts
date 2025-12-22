import { v2 as cloudinary } from 'cloudinary'

// Log configuration status (not the actual secrets)
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ url: string; publicId: string }> {
  // Log all env vars status
  console.log('=== CLOUDINARY DEBUG ===')
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET')
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.slice(0, 5)}...` : 'NOT SET')
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? `${process.env.CLOUDINARY_API_SECRET.slice(0, 5)}...` : 'NOT SET')
  
  // Validate credentials before attempting upload
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary credentials missing!')
    throw new Error('Cloudinary credentials not configured. Please check environment variables.')
  }

  console.log('Starting Cloudinary upload for:', fileName)
  console.log('File buffer size:', fileBuffer.length, 'bytes')
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'model-viewer',
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        console.log('=== CLOUDINARY RESPONSE ===')
        console.log('Error object:', JSON.stringify(error, null, 2))
        console.log('Result object:', JSON.stringify(result, null, 2))
        
        if (error) {
          console.error('Cloudinary upload FAILED!')
          console.error('Error message:', error.message)
          console.error('Error http_code:', error.http_code)
          console.error('Error name:', error.name)
          console.error('Full error:', error)
          reject(new Error(`Cloudinary upload failed: ${error.message || JSON.stringify(error)}`))
        } else if (result) {
          console.log('Cloudinary upload SUCCESS!')
          console.log('Public ID:', result.public_id)
          console.log('Secure URL:', result.secure_url)
          console.log('Bytes:', result.bytes)
          console.log('Format:', result.format)
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        } else {
          console.error('Cloudinary returned neither error nor result!')
          reject(new Error('Cloudinary returned no result'))
        }
      }
    )
    
    uploadStream.on('error', (err) => {
      console.error('Cloudinary STREAM error:', err)
      console.error('Stream error message:', err.message)
      console.error('Stream error stack:', err.stack)
      reject(new Error(`Cloudinary stream error: ${err.message}`))
    })
    
    console.log('Sending buffer to Cloudinary...')
    uploadStream.end(fileBuffer)
    console.log('Buffer sent to Cloudinary stream')
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
}

export default cloudinary


