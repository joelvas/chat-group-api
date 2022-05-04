const User = require('../models/user')
const Log = require('../models/log')
const bycryptjs = require('bcryptjs')
const { generateJWT } = require('../helpers/generate-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    //Email exists
    if (!user) {
      return res.status(400).json({
        msg: 'User does not exist.'
      })
    }
    //Active user
    if (!user.status) {
      return res.status(400).json({
        msg: 'User does not active.'
      })
    }
    //Valid password
    const validPassword = bycryptjs.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Invalid password.'
      })
    }
    //Generate jwt
    const token = await generateJWT(user.id)
    const log = new Log({ user: user.id })
    await log.save()

    return res.json({
      user,
      token
    })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({
      msg: 'Contact with the administrator.'
    })
  }
}

const googleSignIn = async (req, res) => {
  const { id_token } = req.body
  try {
    const { email, name, img } = await googleVerify(id_token)

    let user = await User.findOne({ email })

    if (!user) {
      const data = {
        name,
        email,
        img,
        google: true,
        password: ':P',
        role: 'USER_ROLE'
      }
      user = new User(data)
      await user.save()
    }

    //Check if user was removed
    if (!user.status) {
      return res.status(401).json({
        msg: 'User was removed or blocked. Contact with the administrator.'
      })
    }

    //Generate token
    const token = await generateJWT(user.id)

    res.json({
      user,
      token
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      ok: false,
      msg: 'Could not verify token'
    })
  }
}

const refreshToken = async (req, res) => {
  const { user } = req
  const token = await generateJWT(user.id)
  return res.json({ user, token })
}

const facebookSignIn = async () => {
  return res.json({ msg: 'facebok sign in soon' })
}

module.exports = {
  login,
  googleSignIn,
  refreshToken,
  facebookSignIn
}