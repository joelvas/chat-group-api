const { Schema, model } = require('mongoose')

const ChannelSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  description: {
    type: String
  },
  password: {
    type: String,
  },
  private: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: String,
    default: Date.now
  },
})

ChannelSchema.methods.toJSON = function () {
  const { __v, updated_at, password, ...channel } = this.toObject();
  return channel
}

module.exports = model('Channel', ChannelSchema)

