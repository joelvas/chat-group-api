import { Router } from 'express'
import { search, getAll } from '../controllers/channels.controller.js'
import { validateJWT } from '../middlewares/validate-jwt.js'

const router = Router()

router.get('/search/:search', [validateJWT], search)

router.get('', [validateJWT], getAll)

export default router
