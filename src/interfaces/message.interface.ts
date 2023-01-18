import { IChannel } from './channel.interface.js'
import { SchemaDefinitionProperty, Types } from 'mongoose'
import { IUser } from './user.interface.js'

export interface IMessage {
  _id: Types.ObjectId,
  id: string
  text: string
  user: Types.ObjectId
  channel: Types.ObjectId
  created_at: SchemaDefinitionProperty<String>
}
