const { Router } = require('express')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validate-fields')
const { login, googleSignIn, facebookSignIn } = require('../controllers/auth')

const router = Router()

router.post('/login', [], login)
router.post('/google', [], googleSignIn)
router.post('/facebook', [], facebookSignIn)

module.exports = router