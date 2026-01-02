import mongoose, { Schema, models, Model as MongooseModel } from 'mongoose'
import { IModel } from '@/types'

const ModelSchema = new Schema<IModel>(
  {
    name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
      maxlength: [100, 'Model name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    uploader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader is required'],
    },
    vertexCount: {
      type: Number,
      default: 0,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    // New fields
    modelType: {
      type: String,
      enum: ['building', 'asset', 'other'],
      required: [true, 'Model type is required'],
      default: 'other',
    },
    landType: {
      type: String,
      enum: ['plot', 'double-plot', 'block', 'double-block', 'super-block', 'none'],
      default: 'none',
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

ModelSchema.index({ createdAt: -1 })
ModelSchema.index({ uploader: 1 })
ModelSchema.index({ modelType: 1 })
ModelSchema.index({ landType: 1 })

const Model3D: MongooseModel<IModel> = models.Model3D || mongoose.model<IModel>('Model3D', ModelSchema, 'model3ds')

export default Model3D


