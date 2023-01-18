import { SchemaDefinitionProperty, Types } from 'mongoose'

export interface IRole {
  _id: Types.ObjectId,
  id: string
  role: string
  created_at: SchemaDefinitionProperty<String>
}
