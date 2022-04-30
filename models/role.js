const { Schema, model } = require('mongoose')

const RoleSchema = Schema({
  role: {
    type: String,
    required: [true, 'Role is required']
  },
  created_at: {
    type: String,
    default: new Date().getTime()
  },
  updated_at: {
    type: String,
    default: new Date().getTime()
  }
})

RoleSchema.methods.toJSON = function () {
  const { __v, updated_at, ...role } = this.toObject();
  return role
}

module.exports = model('Role', RoleSchema)