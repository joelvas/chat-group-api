const { Router } = require('express')
const { search, getAll } = require('../controllers/channels')
const { validateJWT } = require('../middlewares/')

const router = Router()

router.get('/search/:search', [validateJWT], search)

router.get('', [validateJWT], getAll)

module.exports = router
