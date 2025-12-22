import { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  email: string
  username: string
  password: string
  createdAt: Date
}

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
  createdAt: string
}

export interface SessionUser {
  id: string
  email: string
  username: string
}


