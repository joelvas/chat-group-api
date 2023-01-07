const { Subscription } = require('../../models')

const onDisconnect = async ({ io, user, socket }) => {
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
}

module.exports = {
  onDisconnect
}
