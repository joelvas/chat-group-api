import { Router } from 'express'
import { getAllMessages } from '../controllers/messages.controller.js'
import { validateJWT } from '../middlewares/validate-jwt.js'

const router = Router()

router.get('', [validateJWT], getAllMessages)

export default router
