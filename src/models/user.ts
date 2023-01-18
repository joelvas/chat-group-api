import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces/user.interface.js'

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required.']
  },
  bio: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  img: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: String,
    default: Date.now
  }
})

UserSchema.methods.toJSON = function () {
  const { __v, password, updated_at, ...user } = this.toObject()
  return user
}

UserSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

UserSchema.set('toJSON', {
  virtuals: true
})

UserSchema.set('toObject', { virtuals: true })

export default model('User', UserSchema)
