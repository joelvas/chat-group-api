import { SchemaDefinitionProperty, Types } from "mongoose"

export interface IChannel {
  _id: Types.ObjectId,
  id: string
  name: string
  description: string
  password: string
  private: boolean
  created_at: SchemaDefinitionProperty<number> 
}