const { validateJWT } = require('../helpers/generate-jwt')
const { Channel, Subscription, Message } = require('../models')

const socketController = async (socket, io) => {
  //validating JWT
  const user = await validateJWT(socket.handshake.headers['x-token'])
  if (!user) {
    return socket.disconnect()
  }

  //Getting all channels in database and last subscription
  const [channels, subscription] = await Promise.all([
    Channel.find(),
    Subscription.findOne({ user: user.id })
  ])

  let currentChannel
  let currentChannelSubs
  let currentMembers

  if (subscription) currentChannel = await Channel.findById(subscription.channel)
  if (currentChannel) socket.emit('current-channel', currentChannel)

  if (currentChannel) currentChannelSubs = await Subscription.find({ channel: currentChannel.id }).populate('user')
  if (currentChannelSubs) currentMembers = currentChannelSubs.map(ch => ch.user)
  if (currentMembers) io.to(currentChannel.id).emit('current-members', currentMembers)
  socket.emit('channels-list', channels)

  socket.on('create-channel', async (payload, callback) => {
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

  socket.on('join-channel', async (channel) => {
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
    const currentMessages = await Message.find({ channel: channel._id }).populate('user')
    io.to(channel._id).emit('current-messages', currentMessages.reverse())

    //getting channel members from database
    currentChannelSubs = await Subscription
      .find({ channel: channel._id }).populate('user')
    if (currentChannelSubs) currentMembers = currentChannelSubs.map(ch => ch.user)

    //sending new member to the channel
    socket.broadcast.to(channel._id).emit('new-member', user)

    //getting current users
    socket.emit('current-members', currentMembers)
  })

  socket.on('create-message', async (payload) => {
    const newMsg = new Message({
      text: payload.text,
      channel: payload.channel,
      user: user.id
    })
    await newMsg.save()
    const populatedMsg = await newMsg.populate('user')
    io.to(payload.channel).emit('new-message', populatedMsg)
  })

  socket.on('disconnect', async () => {
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