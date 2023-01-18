import Message from '../../models/message.js'
import Channel from '../../models/channel.js'
import SocketResponse from '../../models/socket-response.js'
import { IMessage } from '../../interfaces/message.interface.js'
import { SocketHandler } from '../../interfaces/socket-handler.interface.js'

const onCreateMessage = async (
  { io, user, socket }: SocketHandler,
  payload: IMessage,
  callback: (response: IMessage | SocketResponse) => any
) => {
  try {
    if (payload.text === '') return false
    const channel = await Channel.findOne({ _id: payload.channel })

    if (channel === null) {
      callback(new SocketResponse(false, 'Channel not found'))
      return
    }

    const newMsg = new Message({
      text: payload.text,
      channel: channel._id,
      user: user.id
    })

    await newMsg.save()
    const populatedMsg = await newMsg.populate(['user', 'channel'])

    socket.broadcast
      .to(channel._id.toString())
      .emit('new-message', populatedMsg)

    callback(populatedMsg)
  } catch (err) {
    console.log(err)
    callback(new SocketResponse(false, 'There was an error'))
  }
}

const onDeleteMessage = async (
  { io, user, socket }: SocketHandler,
  payload: IMessage,
  callback: (response: IMessage | SocketResponse) => any
) => {
  try {
    const message = await Message.findOne({ _id: payload.id }).populate([
      'channel',
      'user'
    ])

    if (message === null) {
      callback(new SocketResponse(false, 'Message not found'))
      return
    }

    if (message.user._id.toString() !== user.id) {
      callback(new SocketResponse(false, 'You cannot delete this message'))
    }

    await Message.deleteOne({ _id: message._id })
    socket.broadcast
      .to(message.channel._id.toString())
      .emit('remove-message', message)

    callback(new SocketResponse(true, 'Message deleted successfully'))
  } catch (err) {
    console.log(err)
    callback(new SocketResponse(false, 'There was an error'))
  }
}

export {
  onCreateMessage,
  onDeleteMessage
}
