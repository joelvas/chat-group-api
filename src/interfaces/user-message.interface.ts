import { Types, SchemaDefinitionProperty, Document } from 'mongoose'

export interface IUserMessage {
  _id: Types.ObjectId
  id?: string
  user: Types.ObjectId
  message: Types.ObjectId
  recieved: boolean
  read: boolean
  created_at: SchemaDefinitionProperty<String>
}

export type UserMessageDocument = IUserMessage & Document
