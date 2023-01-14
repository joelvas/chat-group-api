const { Router } = require('express')
const { check } = require('express-validator')
const {
  login,
  googleSignIn,
  facebookSignIn,
  restorePassword
} = require('../controllers/auth')
const {
  validateJWT,
  validateFields,
  isAdminOrOwner
} = require('../middlewares/')
const {
  roleExists,
  userByEmailNotExists,
  userByIdExists
} = require('../helpers/db-validators')

const router = Router()

router.post('/login', [], login)
router.post('/google', [], googleSignIn)
router.post('/facebook', [], facebookSignIn)
router.post(
  '/restore',
  [
    validateJWT,
    isAdminOrOwner,
    check('email', 'Invalid email.').isEmail(),
    check(
      'password',
      'Password length should be more than 6 characteres.'
    ).isLength({ min: 6 }),
    check('email').custom(userByEmailNotExists)
  ],
  restorePassword
)

module.exports = router
