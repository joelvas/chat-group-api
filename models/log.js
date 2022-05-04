const { Schema, model } = require('mongoose')

const LogSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  login_at: {
    type: String,
    default: Date.now
  },
})

LogSchema.methods.toJSON = function () {
  const { __v, ...log } = this.toObject();
  return log
}

module.exports = model('Log', LogSchema)

