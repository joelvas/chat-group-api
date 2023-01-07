const bcryptjs = require('bcryptjs')
const { generateJWT } = require('../helpers/generate-jwt')
const User = require('../models/user')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const getUsers = async (req, res) => {
  const { limit = 5, page = 1 } = req.query
  const query = { status: true }
  const skip = (page - 1) * limit

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
const getUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  return res.json(user)
}
const postUser = async (req, res) => {
  const { name, email, password } = req.body
  let role = 'USER_ROLE'
  const user = new User({ name, email, password, role })

  const salt = bcryptjs.genSaltSync()
  user.password = bcryptjs.hashSync(password, salt)

  await user.save()
  const token = await generateJWT(user.id)
  res.status(201).json({ user, token })
}
const putUser = async (req, res) => {
  const { id } = req.params
  const { _id, password, email, google, role, ...rest } = req.body
  const files = req.files
  if (files) {
    const image = files.image
    if (req.user.img) {
      const nameArr = req.user.img.split('/')
      const name = nameArr[nameArr.length - 1]
      const [public_id] = name.split('.')
      cloudinary.uploader.destroy('chat-group/' + public_id)
    }
    const { secure_url } = await cloudinary.uploader
      .upload(image.tempFilePath, { folder: 'chat-group' })
      .catch((err) => {
        if (err.response) console.log(err.response.data)
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
const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(id, { status: false })
  res.json({ user })
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser
}
