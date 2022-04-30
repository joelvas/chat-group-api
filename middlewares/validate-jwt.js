const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      msg: 'No token recieved'
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid)

    if (!user) {
      return res.status(401).json({
        msg: 'User does not exist in th database.'
      })
    }
    if (!user.status) {
      return res.status(401).json({
        msg: 'User does not active.'
      })
    }

    req.user = user
    next();

  } catch (err) {
    console.log(err)
    return res.status(401).json({
      msg: 'Invalid token.'
    })

  }
}

module.exports = {
  validateJWT
}