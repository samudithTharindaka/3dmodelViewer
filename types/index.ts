import { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  email: string
  username: string
  password: string
  createdAt: Date
}

export type ModelType = 'building' | 'asset' | 'other'
export type LandType = 'plot' | 'double-plot' | 'block' | 'double-block' | 'super-block' | 'none'

export interface IModel {
  _id: Types.ObjectId
  name: string
  description: string
  fileUrl: string
  publicId: string
  thumbnailUrl: string
  uploader: Types.ObjectId | IUser
  vertexCount: number
  fileSize: number
  modelType: ModelType
  landType: LandType
  height: number
  createdAt: Date
}

export interface ModelCardData {
  _id: string
  name: string
  description: string
  fileUrl: string
  thumbnailUrl: string
  uploaderName: string
  vertexCount: number
  fileSize: number
  modelType: ModelType
  landType: LandType
  height: number
  createdAt: string
}

export interface SessionUser {
  id: string
  email: string
  username: string
}


