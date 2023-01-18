import Channel from '../models/channel.js'
import { Request, Response } from 'express'

const search = async (req: Request, res: Response) => {
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

const getAll = async (req: Request, res: Response) => {
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

export {
  search,
  getAll
}
