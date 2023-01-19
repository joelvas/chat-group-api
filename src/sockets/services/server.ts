import Subscription from '../../models/subscription.js'
import { SocketHandler } from '../../interfaces/socket-handler.interface.js'
import {} from 'socket.io'

const onDisconnect = async (
  { io, user, socket }: SocketHandler,
  reason: any
) => {
  console.log('user', user.name, 'disconnected')
  const oldSub = await Subscription.findOne({ user: user.id })
  if (oldSub) {

    io.to(oldSub.channel.toString()).emit('remove-member', user)

    io.in(socket.id).socketsLeave([oldSub.channel.toString()])
  }
}

export { onDisconnect }
