const jwt = require('jsonwebtoken')
const User = require('../models/user')

const validateJWT = async (req, res, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      msg: 'No token recieved',
      message: 'No token recieved',
      success: false
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    const user = await User.findById(uid)

    if (!user) {
      return res.status(401).json({
        msg: 'User does not exist in th database.',
        message: 'User does not exist in th database.',
        success: false
      })
    }
    if (!user.status) {
      return res.status(401).json({
        msg: 'User does not active.',
        message: 'User does not active.',
        success: false
      })
    }

    req.user = user
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      msg: 'Invalid token.',
      message: 'Invalid token.',
      success: false
    })
  }
}

module.exports = {
  validateJWT
}
