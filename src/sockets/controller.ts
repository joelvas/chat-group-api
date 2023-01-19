import { IUser } from './../interfaces/user.interface.js'
import { validateJWT } from '../helpers/generate-jwt.js'
import {
  onCreateChannel,
  onEditChannel,
  onDeleteChannel,
  onJoinChannel,
  onSearchChannel,
  fetchChannels,
  onSuscribeChannel
} from './services/channel.js'
import { Socket, Server } from 'socket.io'
import { onDisconnect } from './services/server.js'
import { onCreateMessage, onDeleteMessage } from './services/message.js'
import { SocketHandler } from '../interfaces/socket-handler.interface.js'
import { fetchSubscriptions } from './services/subscription.js'

const socketController = async (socket: Socket, io: Server) => {
  const token = socket.handshake.headers['x-token']
  const user = (await validateJWT(String(token))) as IUser

  if (!user) {
    return socket.disconnect()
  }
  console.log('user', user.name, 'connected')

  const socketHandler = { io, user, socket } as SocketHandler

  const channels = await fetchChannels()
  const subscriptions = await fetchSubscriptions({ user, io, socket })

  socket.emit('channels-list', channels)

  socket.emit('subscriptions-list', subscriptions)

  socket.on('create-channel', (payload, callback) =>
    onCreateChannel(socketHandler, payload, callback)
  )

  socket.on('subscribe-channel', (payload, callback) =>
    onSuscribeChannel(socketHandler, payload, callback)
  )

  socket.on('edit-channel', (payload, callback) =>
    onEditChannel(socketHandler, payload, callback)
  )

  socket.on('delete-channel', (payload, callback) =>
    onDeleteChannel(socketHandler, payload, callback)
  )

  socket.on('join-channel', (payload, callback) =>
    onJoinChannel(socketHandler, payload, callback)
  )

  socket.on('search-channel', (payload, callback) =>
    onSearchChannel(socketHandler, payload, callback)
  )

  socket.on('create-message', (payload, callback) =>
    onCreateMessage(socketHandler, payload, callback)
  )

  socket.on('delete-message', (payload, callback) =>
    onDeleteMessage(socketHandler, payload, callback)
  )

  socket.on('disconnect', (reason) => onDisconnect(socketHandler, reason))
}

export { socketController }
