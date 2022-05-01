const { Schema, model } = require('mongoose')

const SubscriptionSchema = Schema({
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
  },

})

SubscriptionSchema.methods.toJSON = function () {
  const { __v, updated_at, ...subscription } = this.toObject();
  return subscription
}

module.exports = model('Subscription', SubscriptionSchema)

