const jwt = require('jsonwebtoken')
const { User } = require('../models')

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '365d'
    }, (err, token) => {
      if (err) {
        console.log(err)
        reject('Token was not generated.')
      } else {
        resolve(token);
      }
    })
  })
}

const validateJWT = async (token = '') => {
  try {
    if (token.length < 10) {
      return null
    }
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    const user = await User.findById(uid)
    if (user) {
      if (!user.status) {
        return null
      }
      return user
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

module.exports = { generateJWT, validateJWT }