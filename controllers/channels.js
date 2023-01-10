const { Channel } = require('../models')

const search = async (req, res) => {
  try {
    const { search } = req.params

    const channels = await Channel.find({
      name: { $regex: search, $options: 'i' }
    })

    res.json(channels || [])
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Contact with the administrator',
      msg: 'Contact with the administrator.'
    })
  }
}

const getAll = async (req, res) => {
  try {
    const channels = await Channel.find()

    res.json(channels || [])
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Contact with the administrator',
      msg: 'Contact with the administrator.'
    })
  }
}

module.exports = {
  search,
  getAll
}
