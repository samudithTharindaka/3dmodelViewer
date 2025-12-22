# Vercel Deployment Setup Guide

## Critical: Environment Variables

After pushing to GitHub, you **MUST** set these environment variables on Vercel:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: `3dmodelViewer`
- Go to **Settings** → **Environment Variables**

### 2. Add These Variables:

```env
NEXTAUTH_SECRET=Xj8kP2mN9qR5tV7wY1zB3cD4eF6gH8iJ0kL2mN4oP6qR
NEXTAUTH_URL=https://3dmodel-viewer-six.vercel.app
MONGODB_URI=your-mongodb-connection-string
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NODE_ENV=production
```

**Important Notes:**
- Replace `NEXTAUTH_SECRET` with the value from your local `.env` file
- Update `NEXTAUTH_URL` to match your actual Vercel URL
- Use your actual MongoDB and Cloudinary credentials
- Set these for **Production** environment

### 3. Redeploy

After setting environment variables:
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (1-2 minutes)

## Testing After Deployment

1. **Clear browser cache and cookies** for your Vercel site
2. **Register a new account** or login
3. **Try uploading a small model** (< 5MB first)
4. Check the upload works

## File Size Limits

- **Maximum file size:** 10MB (Vercel free tier limit)
- **Supported formats:** GLB, GLTF
- **Function timeout:** 30 seconds

## Troubleshooting

### Still getting "Forbidden" error?
1. Check environment variables are set correctly
2. Make sure `NEXTAUTH_SECRET` is NOT "any-random-32-character-string"
3. Clear browser cookies and login again
4. Check Vercel function logs

### Upload timing out?
1. Reduce file size (try < 5MB)
2. Check your internet connection
3. Verify Cloudinary credentials are correct

### Can't login?
1. Verify `NEXTAUTH_SECRET` is set on Vercel
2. Verify `NEXTAUTH_URL` matches your Vercel URL
3. Check MongoDB connection string is correct
4. Clear cookies and try again

## Vercel Function Logs

To see detailed error logs:
1. Go to your Vercel project
2. Click **Deployments** → Latest deployment
3. Click **Functions** tab
4. Look for `/api/upload` errors

## Need Help?

Check these:
- Vercel logs for detailed errors
- Browser console for client-side errors
- MongoDB Atlas to verify connection
- Cloudinary dashboard to verify credentials

