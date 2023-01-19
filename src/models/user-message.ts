import { Schema, model } from 'mongoose'
import { IUserMessage } from '../interfaces/user-message.interface.js'

const UserMessageSchema = new Schema<IUserMessage>({
  read: {
    type: Boolean,
    default: false
  },
  recieved: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  created_at: {
    type: String,
    default: Date.now
  }
})

UserMessageSchema.methods.toJSON = function () {
  const { __v, updated_at, ...userMessage } = this.toObject()
  return userMessage
}

UserMessageSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

UserMessageSchema.set('toJSON', {
  virtuals: true
})

UserMessageSchema.set('toObject', { virtuals: true })

export default model('UserMessage', UserMessageSchema)
