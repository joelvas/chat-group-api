import { Router } from 'express';
import { check } from 'express-validator';
import { getUsers, getUser, postUser, putUser, deleteUser } from '../controllers/users.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { isAdminOrOwner } from '../middlewares/validate-roles.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { roleExists, userByEmailNotExists, userByIdExists } from '../helpers/db-validators.js';
const router = Router();
router.get('/', getUsers);
router.get('/:id', [validateJWT, isAdminOrOwner, userByIdExists], getUser);
router.post('/', [
    check('name', 'Name is required.').notEmpty(),
    check('email', 'Invalid email.').isEmail(),
    check('password', 'Password length should be more than 6 characteres.').isLength({ min: 6 }),
    check('email').custom(userByEmailNotExists),
    validateFields
], postUser);
router.put('/:id', [
    validateJWT,
    isAdminOrOwner,
    check('id', 'Invalid mongo id.').isMongoId(),
    check('id').custom(userByIdExists),
    check('role').custom(roleExists),
    validateFields
], putUser);
router.delete('/:id', [
    validateJWT,
    isAdminOrOwner,
    check('id', 'Invalid mongo id.').isMongoId(),
    check('id').custom(userByIdExists),
    validateFields
], deleteUser);
export default router;
