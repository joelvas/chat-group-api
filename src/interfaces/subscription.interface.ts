import { SchemaDefinitionProperty, Types, Document } from 'mongoose'

export interface ISubscription {
  _id: Types.ObjectId
  id: string
  user: Types.ObjectId
  channel: Types.ObjectId
  created_at: SchemaDefinitionProperty<String>
}

export type SubscriptionDocument = ISubscription & Document
