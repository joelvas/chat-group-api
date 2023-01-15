const { Message, Channel, SocketResponse } = require('../../models')

const onCreateMessage = async ({ payload, callback, socket, user }) => {
  try {
    if (payload.text === '') return false
    const channel = await Channel.findOne({ _id: payload.channel })

    const newMsg = new Message({
      text: payload.text,
      channel: channel._id,
      user: user.id
    })

    await newMsg.save()
    const populatedMsg = await newMsg.populate(['user', 'channel'])

    socket.broadcast.to(payload.channel).emit('new-message', populatedMsg)

    callback(populatedMsg)
  } catch (err) {
    callback(new SocketResponse(false, 'There was an error'))
  }
}

const onDeleteMessage = async ({ payload, callback, socket, user }) => {
  const message = await Message.findOne({ _id: payload.id }).populate([
    'channel',
    'user'
  ])
  if (message.user.id !== user.id) {
    callback(new SocketResponse(false, 'You cannot delete this message'))
  }
  await Message.deleteOne({ _id: message._id })
  socket.broadcast.to('remove-message', message)
  callback(new SocketResponse(true, 'Message deleted successfully'))
}

module.exports = {
  onCreateMessage,
  onDeleteMessage
}
