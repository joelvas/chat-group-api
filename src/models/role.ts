import { IRole } from '../interfaces/role.interface.js'
import { Schema, model } from 'mongoose'

const RoleSchema = new Schema<IRole>({
  role: {
    type: String,
    required: [true, 'Role is required']
  },
  created_at: {
    type: String,
    default: Date.now
  }
})

RoleSchema.methods.toJSON = function () {
  const { __v, updated_at, ...role } = this.toObject()
  return role
}

export default model('Role', RoleSchema)
