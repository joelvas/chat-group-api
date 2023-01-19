import { UserDocument } from './../../interfaces/user.interface.js'
import { SocketHandler } from '../../interfaces/socket-handler.interface.js'
import { IChannel } from '../../interfaces/channel.interface.js'
import Channel from '../../models/channel.js'
import Subscription from '../../models/subscription.js'
import Message from '../../models/message.js'
import SocketResponse from '../../models/socket-response.js'

const fetchChannels = async () => {
  const channels = await Channel.find()
  return channels
}

const onCreateChannel = async (
  { io, user, socket }: SocketHandler,
  payload: IChannel,
  callback: (response: IChannel | SocketResponse) => any
) => {
  if (payload.name === '')
    callback(new SocketResponse(false, 'Name is required.'))

  const channelExists = await Channel.find({ name: payload.name })
  if (channelExists) callback(new SocketResponse(false, 'Room already exists'))

  const newChannel = new Channel(payload)
  await newChannel.save()

  const newSub = new Subscription({ user: user.id, channel: newChannel.id })
  await newSub.save()

  socket.join(newChannel.id)

  socket.emit('current-members', [user])

  io.emit('new-channel', newChannel)

  callback(newChannel)
}

const onEditChannel = async (
  { io }: SocketHandler,
  payload: IChannel,
  callback: (response: IChannel | SocketResponse) => any
) => {
  const channelExists = await Channel.findOne({ _id: payload._id })

  if (channelExists === null) {
    callback(new SocketResponse(false, 'Room does not exist'))
    return
  }

  if (!!payload.password && payload.password !== '') {
    channelExists.password = payload.password
    channelExists.private = true
  }

  const channelUpdated = await Channel.findByIdAndUpdate(
    channelExists._id,
    channelExists,
    {
      new: false
    }
  )

  io.emit('channel-updated', channelUpdated)
  callback(channelUpdated as IChannel)
}

const onDeleteChannel = async (
  { io }: SocketHandler,
  payload: IChannel,
  callback: (response: boolean) => any
) => {
  await Channel.deleteOne({ _id: payload._id })
  io.emit('remove-channel', payload)
  callback(true)
}

const onJoinChannel = async (
  { user, socket }: SocketHandler,
  payload: IChannel,
  callback: (response: SocketResponse | IChannel) => any
) => {
  const channel = await Channel.findOne({ _id: payload._id })

  if (channel === null) {
    callback(new SocketResponse(false, 'Room does not exist'))
    return
  }

  const isPasswordCorrect = payload.password == channel.password

  const currentChannelSubs = await Subscription.find({
    channel: channel._id
  }).populate<{ user: UserDocument }>('user')

  const userSubscribed = currentChannelSubs.find((sub) => {
    return sub.user._id.toString() === user.id
  })

  if (
    !channel.private ||
    (channel.private && userSubscribed) ||
    (channel.private && isPasswordCorrect)
  ) {
    socket.join(channel._id.toString())

    const currentMessages = await Message.find({
      channel: channel._id
    }).populate('user')

    socket.emit('current-messages', currentMessages.reverse())

    const currentMembers = currentChannelSubs.map((sub) => sub.user) || []

    socket.broadcast.to(channel._id.toString()).emit('new-member', user)

    socket.emit('current-members', currentMembers)

    callback(channel)
  } else {
    callback(new SocketResponse(false, 'You are not allowed to join this room'))
  }
}

const onSuscribeChannel = async (
  { user, socket }: SocketHandler,
  payload: IChannel,
  callback: (response: SocketResponse) => any
) => {
  const channel = await Channel.findOne({ _id: payload.id })
  if (channel === null) {
    callback(new SocketResponse(false, 'Room does not exist'))
    return
  }

  const subscriptions = await Subscription.find({
    user: user.id
  }).populate('channel')

  const currentSub = subscriptions.find((sub) => {
    return sub.channel._id.toString() === payload.id
  })

  if (currentSub) {
    socket.emit('subscriptions-list', subscriptions)
    callback(new SocketResponse(true, 'You subscribed successfully'))
  } else {
    const newSub = new Subscription({ user: user.id, channel: channel._id })
    await newSub.save()
    const populatedSub = await newSub.populate('channel')
    socket.emit('subscriptions-list', [...subscriptions, populatedSub])
    callback(new SocketResponse(true, 'You subscribed successfully'))
  }
}

const onSearchChannel = async (
  { io, user, socket }: SocketHandler,
  payload: IChannel,
  callback: (response: IChannel[]) => any
) => {
  const channels = await Channel.find({
    name: { $regex: payload, $options: 'i' }
  })
  callback(channels)
}

const onUnsuscribeChannel = async (
  { io, user, socket }: SocketHandler,
  payload: IChannel,
  callback: (response: SocketResponse) => any
) => {
  const channel = await Channel.findOne({ _id: payload._id })
  if (channel === null) {
    callback(new SocketResponse(false, 'Room does not exist'))
    return
  }
  const currentSub = await Subscription.findOne({
    channel: channel._id,
    user: user.id
  })

  if (currentSub) {
    //removing last sub in database
    await Subscription.deleteOne({ _id: currentSub._id })

    //removing from user data
    io.to(currentSub.channel.toString()).emit('remove-member', user)

    //removing from socket channel
    io.in(socket.id).socketsLeave([currentSub.channel.toString()])

    callback(new SocketResponse(true, 'You left successfully'))
  } else {
    callback(new SocketResponse(false, 'There was an error'))
  }
}

export {
  onCreateChannel,
  onEditChannel,
  onDeleteChannel,
  onJoinChannel,
  onSearchChannel,
  fetchChannels,
  onSuscribeChannel,
  onUnsuscribeChannel
}
