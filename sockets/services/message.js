const { Message } = require('../../models')

const onCreateMessage = async ({ payload, io, user }) => {
  if (payload.text === '') return false
  const newMsg = new Message({
    text: payload.text,
    channel: payload.channel,
    user: user.id
  })
  await newMsg.save()
  const populatedMsg = await newMsg.populate('user')
  io.to(payload.channel).emit('new-message', populatedMsg)
}

module.exports = {
  onCreateMessage
}
