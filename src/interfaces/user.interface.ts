import { SchemaDefinitionProperty, Types, Document } from 'mongoose'
import { SubscriptionDocument } from './subscription.interface.js'

export interface IUser {
  _id: Types.ObjectId
  id: string
  name: string
  bio: string
  phone: string
  email: string
  password: string
  img: string
  role: string
  subscriptions?: SubscriptionDocument[]
  status: boolean
  google: boolean
  created_at: SchemaDefinitionProperty<String>
}

export type UserDocument = IUser & Document
