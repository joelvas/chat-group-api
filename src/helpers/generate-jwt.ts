import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/user.js'

const privateKey = String(process.env.SECRETORPRIVATEKEY)

const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }
    jwt.sign(
      payload,
      privateKey,
      {
        expiresIn: '365d'
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('Token was not generated.')
        } else {
          resolve(token)
        }
      }
    )
  })
}

const validateJWT = async (token = '') => {
  try {
    if (token.length < 10) {
      return null
    }
    const { uid } = jwt.verify(token, privateKey) as JwtPayload
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

export { generateJWT, validateJWT }
