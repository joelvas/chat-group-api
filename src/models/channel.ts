import { Schema, model } from 'mongoose'
import { IChannel } from '../interfaces/channel.interface.js'

const ChannelSchema = new Schema<IChannel>({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  description: {
    type: String
  },
  password: {
    type: String
  },
  private: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: String,
    default: Date.now
  }
})

ChannelSchema.methods.toJSON = function () {
  const { __v, updated_at, password, ...channel } = this.toObject()
  return channel
}

ChannelSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

ChannelSchema.set('toJSON', {
  virtuals: true
})

ChannelSchema.set('toObject', { virtuals: true })

export default model('Channel', ChannelSchema)
