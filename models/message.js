const { Schema, model } = require('mongoose')

const MessageSchema = Schema({
  text: {
    type: String,
    required: [true, 'Text is required.'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel'
  },
  created_at: {
    type: String,
    default: Date.now
  }
})

MessageSchema.methods.toJSON = function () {
  const { __v, updated_at, ...message } = this.toObject();
  return message
}

module.exports = model('Message', MessageSchema)

