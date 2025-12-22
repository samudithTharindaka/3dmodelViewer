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
  // Validate credentials before attempting upload
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary credentials missing!')
    throw new Error('Cloudinary credentials not configured. Please check environment variables.')
  }

  console.log('Starting Cloudinary upload for:', fileName)
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'model-viewer',
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
          })
          reject(new Error(`Cloudinary upload failed: ${error.message}`))
        } else if (result) {
          console.log('Cloudinary upload success:', {
            public_id: result.public_id,
            url: result.secure_url,
            bytes: result.bytes,
          })
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          })
        } else {
          reject(new Error('Cloudinary returned no result'))
        }
      }
    )
    
    uploadStream.on('error', (err) => {
      console.error('Cloudinary stream error:', err)
      reject(new Error(`Cloudinary stream error: ${err.message}`))
    })
    
    uploadStream.end(fileBuffer)
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
}

export default cloudinary


