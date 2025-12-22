# ModelViewer - 3D Model Gallery

A modern web application for uploading and viewing 3D models built with Next.js 14, Three.js, MongoDB, and Cloudinary.

## Features

### 🎨 User Interface
- ✅ **Light/Dark Theme Toggle** - Seamless theme switching with system preference detection
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Smooth Animations** - Beautiful transitions and hover effects
- ✅ **Glass Morphism UI** - Modern, semi-transparent card design

### 🔐 Authentication
- ✅ **User Registration** - Create account with email and username
- ✅ **Secure Login** - Password hashing with bcrypt
- ✅ **Session Management** - JWT-based authentication with NextAuth.js
- ✅ **Protected Routes** - Middleware-based route protection

### 📦 3D Model Management
- ✅ **Upload Models** - Drag & drop GLB/GLTF files (up to 10MB)
- ✅ **Auto Vertex Count** - Automatically extracts vertex count from models
- ✅ **Public Gallery** - Browse all uploaded models
- ✅ **Model Details Page** - Full-screen 3D viewer with metadata

### 👤 Profile & CRUD Operations
- ✅ **User Profile Page** - View all your uploaded models
- ✅ **Edit Models** - Update model name and description
- ✅ **Delete Models** - Remove models with confirmation
- ✅ **Model Statistics** - Track uploads, vertex counts, file sizes

### 🎮 3D Viewer Features
- ✅ **Interactive Controls** - Rotate, pan, zoom with mouse
- ✅ **Auto-Rotate Toggle** - Automatic model rotation
- ✅ **Grid Helper** - Reference grid for scale
- ✅ **Environment Lighting** - Realistic HDRI lighting
- ✅ **Enhanced Zoom** - Zoom out up to 100 units for large models

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| 3D Rendering | Three.js via @react-three/fiber + @react-three/drei |
| Database | MongoDB with Mongoose |
| Authentication | NextAuth.js (Credentials provider) |
| File Storage | Cloudinary |
| Styling | Tailwind CSS + next-themes |
| Validation | Zod |

## Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/samudithTharindaka/3dmodelViewer.git
   cd 3dmodelViewer
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Create environment file**:
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://your-connection-string
   NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
   NEXTAUTH_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Get MongoDB URI**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a free cluster
   - Get your connection string from "Connect" > "Drivers"

5. **Get Cloudinary credentials**:
   - Go to [Cloudinary](https://cloudinary.com/)
   - Sign up for free
   - Find credentials in Dashboard

6. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```
   Or use any random 32+ character string.

7. **Run the development server**:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started
1. **Register** a new account at `/register`
2. **Login** with your credentials at `/login`
3. You'll be redirected to the home gallery

### Uploading Models
1. Click **"Upload"** in the navbar
2. **Drag & drop** or click to select a GLB/GLTF file
3. Enter model **name** and **description** (optional)
4. Click **"Upload Model"**
5. Model will appear in the gallery and your profile

### Managing Your Models
1. Go to **"Profile"** in the navbar
2. View all your uploaded models
3. **Edit**: Click the pencil icon to update name/description
4. **Delete**: Click the trash icon to remove a model
5. **View**: Click the eye icon or model preview to see in 3D

### 3D Viewer Controls
- **Left Click + Drag**: Rotate model
- **Right Click + Drag**: Pan camera
- **Scroll**: Zoom in/out (0.5 to 100 units)
- **Auto-Rotate Button**: Toggle automatic rotation
- **Grid Button**: Show/hide reference grid

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Models
- `GET /api/models` - Get all models
- `GET /api/models/[id]` - Get single model
- `POST /api/upload` - Upload new model (authenticated)
- `PATCH /api/models/[id]` - Update model (owner only)
- `DELETE /api/models/[id]` - Delete model (owner only)

## Project Structure

```
3dmodelViewer/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── models/       # Model CRUD endpoints
│   │   └── upload/       # File upload endpoint
│   ├── model/[id]/        # Model detail page
│   ├── profile/           # User profile with CRUD
│   ├── upload/            # Upload page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home gallery
├── components/            # React components
│   ├── ModelViewer.tsx   # 3D viewer component
│   ├── ModelCard.tsx     # Gallery card
│   ├── UploadForm.tsx    # Upload form
│   ├── Navbar.tsx        # Navigation
│   ├── ThemeToggle.tsx   # Theme switcher
│   └── AuthForm.tsx      # Login/register form
├── lib/                   # Utility functions
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # NextAuth config
│   └── cloudinary.ts     # File upload helper
├── models/                # Mongoose schemas
│   ├── User.ts           # User model
│   └── Model.ts          # 3D Model model
└── types/                 # TypeScript types
    └── index.ts
```

## Features in Detail

### Profile Page (`/profile`)
- View all models uploaded by the logged-in user
- Edit model name and description inline
- Delete models with confirmation dialog
- See statistics: vertex count, file size, upload date
- Quick links to view models in 3D

### Model Management
- **Create**: Upload via `/upload` page
- **Read**: View in gallery or detail page
- **Update**: Edit name/description in profile
- **Delete**: Remove from profile with Cloudinary cleanup

### Security
- Password hashing with bcrypt (12 rounds)
- JWT session tokens
- Protected API routes
- Owner-only edit/delete permissions
- Environment variables for secrets

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
- **Netlify**: Add build command `npm run build`
- **Railway**: Add `railway.json` config
- **Render**: Configure web service

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

[Samudith Tharindaka](https://github.com/samudithTharindaka)

## Acknowledgments

- Next.js team for the amazing framework
- Three.js community for 3D rendering
- React Three Fiber for React integration
- Cloudinary for file hosting

