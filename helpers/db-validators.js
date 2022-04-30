const { Role, User } = require('../models')

const roleExists = async (role = '') => {
  const roleExists = await Role.findOne({ role })
  if (!roleExists) {
    throw new Error(`Role ${role} does not exist.`)
  }
}

const userByEmailNotExists = async (email = '') => {
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error(`E-mail ${email} already exists.`)
  }
}

const userByIdExists = async (id = '') => {
  const userExists = await User.findById(id)
  if (!userExists) {
    throw new Error(`User with id ${id} does not exist.`)
  }
}

const allowedCollections = async (c, collections) => {
  const includes = collections.includes(c);
  if (!includes) {
    throw new Error(`${c} is not an allowed collection.`)
  }
  return true
}

module.exports = {
  roleExists,
  userByEmailNotExists,
  userByIdExists,
  allowedCollections
}