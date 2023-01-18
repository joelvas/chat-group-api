import { Schema, model } from 'mongoose'
import { ISubscription } from '../interfaces/subscription.interface.js'

const SubscriptionSchema = new Schema<ISubscription>({
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

SubscriptionSchema.methods.toJSON = function () {
  const { __v, updated_at, ...subscription } = this.toObject()
  return subscription
}

export default model('Subscription', SubscriptionSchema)
