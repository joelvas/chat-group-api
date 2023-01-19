import { SchemaDefinitionProperty, Types, Document } from 'mongoose'
import { UserDocument } from './user.interface.js'
import { MessageDocument } from './message.interface.js'

export interface IChannel {
  _id: Types.ObjectId
  id: string
  name: string
  description: string
  members?: UserDocument[]
  messages?: MessageDocument[]
  password: string
  private: boolean
  created_at: SchemaDefinitionProperty<number>
}

export type ChannelDocument = IChannel & Document