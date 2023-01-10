const { validateJWT } = require('../helpers/generate-jwt')
const {
  onCreateChannel,
  onEditChannel,
  onDeleteChannel,
  onJoinChannel,
  onSearchChannel,
  fetchChannels
} = require('./services/channel')
const { onDisconnect } = require('./services/server')
const { onCreateMessage } = require('./services/message')

const socketController = async (socket, io) => {
  const user = await validateJWT(socket.handshake.headers['x-token'])
  
  if (!user) {
    return socket.disconnect()
  }
  console.log('user', user.name, 'connected')
  socket.emit('channels-list', fetchChannels())

  socket.on('create-channel', (payload, callback) =>
    onCreateChannel({ payload, callback, io, user, socket })
  )

  socket.on('edit-channel', (payload, callback) =>
    onEditChannel({ payload, callback, io, user, socket })
  )

  socket.on('delete-channel', (payload, callback) =>
    onDeleteChannel({ payload, callback, io, user, socket })
  )

  socket.on('join-channel', (payload, callback) =>
    onJoinChannel({ payload, callback, io, user, socket })
  )

  socket.on('search-channel', (payload, callback) =>
    onSearchChannel({ payload, callback, io, user, socket })
  )

  socket.on('create-message', (payload, callback) =>
    onCreateMessage({ payload, callback, io, user, socket })
  )

  socket.on('disconnect', (payload, callback) =>
    onDisconnect({ payload, callback, io, user, socket })
  )
}

module.exports = {
  socketController
}
