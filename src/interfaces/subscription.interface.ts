import { SchemaDefinitionProperty, Types } from 'mongoose'
import { IChannel } from './channel.interface.js'
import { IUser } from './user.interface.js'

export interface ISubscription {
  _id: Types.ObjectId
  id: string
  user: Types.ObjectId
  channel: Types.ObjectId
  created_at: SchemaDefinitionProperty<String>
}
