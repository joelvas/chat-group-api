import bcryptjs from 'bcryptjs'
import { generateJWT } from '../helpers/generate-jwt.js'
import User from '../models/user.js'
import { Response, Request } from 'express'
import { UploadedFile } from 'express-fileupload'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config(String(process.env.CLOUDINARY_URL))

const getUsers = async (req: Request, res: Response) => {
  const { limit = 5, page = 1 } = req.query
  const query = { status: true }
  const skip = (Number(page) - 1) * Number(limit)

  const [users, total] = await Promise.all([
    User.find(query).limit(Number(limit)).skip(Number(skip)),
    User.countDocuments(query)
  ])

  res.status(200).json({
    limit,
    page,
    total,
    users
  })
}
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await User.findById(id)
  return res.json(user)
}
const postUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  let role = 'USER_ROLE'
  const user = new User({ name, email, password, role })

  const salt = bcryptjs.genSaltSync()
  user.password = bcryptjs.hashSync(password, salt)

  await user.save()
  const token = await generateJWT(user.id)
  res.status(201).json({ user, token })
}
const putUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { _id, password, email, google, role, ...rest } = req.body
  const files = req.files
  if (files) {
    const image = files.image as UploadedFile
    if (req.user?.img) {
      const nameArr = req.user.img.split('/')
      const name = nameArr[nameArr.length - 1]
      const [public_id] = name.split('.')
      cloudinary.uploader.destroy('chat-group/' + public_id)
    }
    const { secure_url } = await cloudinary.uploader
      .upload(image.tempFilePath, { folder: 'chat-group' })
      .catch((err) => {
        if (err.response) console.log(err.response.data)
        return err
      })
    rest.img = secure_url
  }
  rest.updated_at = Date.now
  if (password) {
    const salt = bcryptjs.genSaltSync()
    rest.password = bcryptjs.hashSync(password, salt)
  }

  const user = await User.findByIdAndUpdate(id, rest, {
    returnDocument: 'after'
  })

  res.status(200).json(user)
}
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(id, { status: false })
  res.json({ user })
}

export { getUsers, getUser, postUser, putUser, deleteUser }
