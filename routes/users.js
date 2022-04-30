const { Router } = require('express')
const { check } = require('express-validator')

const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controllers/users')
const { validateJWT, validateFields, isAdminOrOwner } = require('../middlewares/')
const { roleExists, userByEmailNotExists, userByIdExists } = require('../helpers/db-validators')

const router = Router()

router.get('/', getUsers)
router.get('/:id', [
  validateJWT,
  isAdminOrOwner,
  userByIdExists
], getUser)
router.post('/', [
  check('name', 'Name is required.').notEmpty(),
  check('email', 'Invalid email.').isEmail(),
  check('password', 'Password length should be more than 6 characteres.').isLength({ min: 6 }),
  check('email').custom(userByEmailNotExists),
  validateFields
], postUser)
router.put('/:id', [
  validateJWT,
  isAdminOrOwner,
  check('id', 'Invalid mongo id.').isMongoId(),
  check('id').custom(userByIdExists),
  check('role').custom(roleExists),
  validateFields
], putUser)
router.delete('/:id', [
  validateJWT,
  isAdminOrOwner,
  check('id', 'Invalid mongo id.').isMongoId(),
  check('id').custom(userByIdExists),
  validateFields
], deleteUser)

module.exports = router