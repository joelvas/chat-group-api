import Subscription from '../../models/subscription.js'
import { SocketHandler } from '../../interfaces/socket-handler.interface.js'

const fetchSubscriptions = async ({ user }: SocketHandler) => {
  const subscriptions = await Subscription.find({
    user: user._id.toString()
  }).populate('channel')
  return subscriptions || []
}

export { fetchSubscriptions }
