import { SchemaDefinitionProperty, Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId,
  id: string
  name: string
  bio: string
  phone: string
  email: string
  password: string
  img: string
  role: string
  status: boolean
  google: boolean
  created_at: SchemaDefinitionProperty<String>
}
