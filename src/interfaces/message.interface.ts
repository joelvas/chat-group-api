import { SchemaDefinitionProperty, Types, Document } from 'mongoose'

export interface IMessage {
  _id: Types.ObjectId
  id: string
  text: string
  user: Types.ObjectId
  channel: Types.ObjectId
  created_at: SchemaDefinitionProperty<String>
}

export type MessageDocument = IMessage & Document
