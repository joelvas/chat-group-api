const { Message, Channel } = require('../../models')

const onCreateMessage = async ({ payload, io, user }) => {
  if (payload.text === '') return false
  const channel = await Channel.findOne({ _id: payload.channel })

  const newMsg = new Message({
    text: payload.text,
    channel: channel._id,
    user: user.id
  })

  await newMsg.save()
  const populatedMsg = await newMsg.populate(['user', 'channel']).execPopulate()

  io.to(payload.channel).emit('new-message', populatedMsg)
}

module.exports = {
  onCreateMessage
}
