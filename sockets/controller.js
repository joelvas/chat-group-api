const { validateJWT } = require('../helpers/generate-jwt')
const { Channel, Subscription, Message } = require('../models')

const socketController = async (socket, io) => {
  //validating JWT
  const user = await validateJWT(socket.handshake.headers['x-token'])
  if (!user) {
    return socket.disconnect()
  }
  console.log('user', user.name, 'connected')

  //Getting all channels
  const channels = await Channel.find()
  socket.emit('channels-list', channels)

  socket.on('create-channel', async (payload, callback) => {
    if (payload.name === '') return false
    const oldSub = await Subscription.findOne({ user: user.id })
    if (oldSub) {
      //removing last sub in database
      await Subscription.deleteMany({ user: user.id })

      //removing from user data
      io.to(oldSub.channel.toString()).emit('remove-member', user)

      //removing from socket channel
      io.in(socket.id).socketsLeave([oldSub.channel.toString()])

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
  })

  socket.on('edit-channel', async (payload, callback) => {
    if (payload.password) if (payload.password === '') delete payload.password
    if (payload.password) payload.private = true
    const channelUpdated = await Channel.findByIdAndUpdate(payload._id, payload, { new: true })
    io.emit('channel-updated', channelUpdated)
    callback(channelUpdated)
  })

  socket.on('delete-channel', async (payload, callback) => {
    await Channel.deleteOne({ _id: payload._id })
    io.emit('remove-channel', payload)
    callback(true)
  })

  socket.on('join-channel', async (channel, callback) => {
    //verify password
    const cha = await Channel.findOne({ _id: channel._id })
    if (cha.private && channel.password !== cha.password) {
      callback(false)
    } else {
      //getting last subscription
      const oldSub = await Subscription.findOne({ user: user.id })
      if (oldSub) {
        //removing last sub in database
        await Subscription.deleteMany({ user: user.id })

        //removing from user data
        io.to(oldSub.channel.toString()).emit('remove-member', user)

        //removing from socket channel
        io.in(socket.id).socketsLeave([oldSub.channel.toString()])
      }

      //registering new sub in database channel
      const newSub = new Subscription({ user: user.id, channel: channel._id })
      await newSub.save()

      //registering in socket channel
      socket.join(channel._id)

      //getting channel messages
      currentMessages = await Message.find({ channel: channel._id }).populate('user')
      io.to(channel._id).emit('current-messages', currentMessages.reverse())

      //getting channel members from database
      currentChannelSubs = await Subscription
        .find({ channel: channel._id }).populate('user')
      if (currentChannelSubs) currentMembers = currentChannelSubs.map(ch => ch.user)

      //sending new member to the channel
      socket.broadcast.to(channel._id).emit('new-member', user)

      //getting current users
      socket.emit('current-members', currentMembers)
      callback(true)
    }
  })

  socket.on('create-message', async (payload) => {
    if (payload.text === '') return false
    const newMsg = new Message({
      text: payload.text,
      channel: payload.channel,
      user: user.id
    })
    await newMsg.save()
    const populatedMsg = await newMsg.populate('user')
    io.to(payload.channel).emit('new-message', populatedMsg)

  })

  socket.on('search-channel', async (payload, callback) => {
    const channels = await Channel.find({ 'name': { '$regex': payload, '$options': 'i' } })
    callback(channels)
  })

  socket.on('disconnect', async () => {
    console.log('user', user.name, 'disconnected')
    const oldSub = await Subscription.findOne({ user: user.id })
    if (oldSub) {
      //removing last sub in database
      await Subscription.deleteMany({ user: user.id })

      //removing from user data
      io.to(oldSub.channel.toString()).emit('remove-member', user)

      //removing from socket channel
      io.in(socket.id).socketsLeave([oldSub.channel.toString()])
    }

  })

}
module.exports = {
  socketController
}