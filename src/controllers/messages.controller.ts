import { Request, Response } from 'express'
import Message from '../models/message.js'
import ApiResponse from '../models/api-response.js'

export const getAllMessages = async (req: Request, res: Response) => {
  const { channelId } = req.query
  if (!channelId) return res.status(400).json(new ApiResponse(false, ''))
  const messages = await Message.find({
    channel: channelId
  })
    .populate('user')
    .sort('-created_at')
    .limit(50)
    .exec()

  return res.status(200).json(messages)
}
