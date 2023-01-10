const { Channel, Subscription, Message } = require('../../models')

const fetchChannels = async () => {
  const channels = await Channel.find()
  return channels
}

const onCreateChannel = async ({ payload, callback, io, user, socket }) => {
  if (payload.name === '') return false
  
  const oldSub = await Subscription.findOne({ user: user.id })
  if (oldSub) {
    await removeSubscription({ sub: oldSub, user, socket, io })
  }

  //regitering new channel in database
  const newChannel = new Channel(payload)
  await newChannel.save()

  //registering new sub in database channel
  const newSub = new Subscription({ user: user.id, channel: newChannel.id })
  await newSub.save()

  //registering in socket channel
  socket.join(newChannel.id)

  //sending new channel to everybody
  io.emit('new-channel', newChannel)

  //sending current channel to me
  callback(newChannel)
}

const onEditChannel = async ({ payload, callback, io }) => {
  if (payload.password) if (payload.password === '') delete payload.password
  if (payload.password) payload.private = true
  const channelUpdated = await Channel.findByIdAndUpdate(payload._id, payload, {
    new: true
  })
  io.emit('channel-updated', channelUpdated)
  callback(channelUpdated)
}

const onDeleteChannel = async ({ payload, callback, io }) => {
  await Channel.deleteOne({ _id: payload._id })
  io.emit('remove-channel', payload)
  callback(true)
}

const onJoinChannel = async ({ payload, callback, io, user, socket }) => {
  //verify password
  const cha = await Channel.findOne({ _id: payload._id })
  if (cha.private && payload.password !== cha.password) {
    callback(false)
  } else {
    //getting last subscription
    const oldSub = await Subscription.findOne({ user: user.id })
    if (oldSub) {
      await removeSubscription({ sub: oldSub, user, socket, io })
    }

    //registering new sub in database channel
    const newSub = new Subscription({ user: user.id, channel: payload._id })
    await newSub.save()

    //registering in socket channel
    socket.join(payload._id)

    //getting channel messages
    currentMessages = await Message.find({ channel: payload._id }).populate(
      'user'
    )
    io.to(payload._id).emit('current-messages', currentMessages.reverse())

    //getting channel members from database
    currentChannelSubs = await Subscription.find({
      channel: payload._id
    }).populate('user')
    
    if (currentChannelSubs)
      currentMembers = currentChannelSubs.map((ch) => ch.user)

    //sending new member to the channel
    socket.broadcast.to(payload._id).emit('new-member', user)

    //getting current users
    socket.emit('current-members', currentMembers)
    callback(true)
  }
}

const onSearchChannel = async ({ payload, callback }) => {
  const channels = await Channel.find({
    name: { $regex: payload, $options: 'i' }
  })
  callback(channels)
}

const removeSubscription = async ({ sub, user, socket, io }) => {
  //removing last sub in database
  await Subscription.deleteMany({ user: user.id })

  //removing from user data
  io.to(sub.channel.toString()).emit('remove-member', user)

  //removing from socket channel
  io.in(socket.id).socketsLeave([sub.channel.toString()])
}

module.exports = {
  onCreateChannel,
  onEditChannel,
  onDeleteChannel,
  onJoinChannel,
  onSearchChannel,
  fetchChannels
}
