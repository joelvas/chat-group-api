import User from '../models/user.js'
import Log from '../models/log.js'
import bycryptjs from 'bcryptjs'
import { generateJWT } from '../helpers/generate-jwt.js'
import { googleVerify } from '../helpers/google-verify.js'
import { Request, Response } from 'express'
import ApiResponse from '../models/api-response.js'

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    //Email exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist',
        msg: 'User does not exist.'
      })
    }
    //Active user
    if (!user.status) {
      return res.status(400).json({
        success: false,
        message: 'User does not active',
        msg: 'User does not active.'
      })
    }
    //Valid password
    const validPassword = bycryptjs.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password',
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
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Contact with the administrator',
      msg: 'Contact with the administrator.'
    })
  }
}

const restorePassword = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (user === null) {
      return res.status(400).json(new ApiResponse(false, 'User not found'))
    }

    const salt = bycryptjs.genSaltSync()
    user.password = bycryptjs.hashSync(password, salt)

    await user.save()

    res
      .status(200)
      .json({ success: true, message: 'Password restore succesful' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Contact with the administrator',
      msg: 'Contact with the administrator.'
    })
  }
}

const googleSignIn = async (req: Request, res: Response) => {
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

// const refreshToken = async (req: Request, res: Response) => {
//   const token = await generateJWT(req.user?.id)
//   return res.json({ user: req.user, token })
// }

const facebookSignIn = async (req: Request, res: Response) => {
  return res.json({ msg: 'facebok sign in soon' })
}

export { login, googleSignIn, facebookSignIn, restorePassword }
