import { Router } from 'express';
import { check } from 'express-validator';
import { login, googleSignIn, facebookSignIn, restorePassword } from '../controllers/auth.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { isAdminOrOwner } from '../middlewares/validate-roles.js';
import { userByEmailNotExists } from '../helpers/db-validators.js';
const router = Router();
router.post('/login', [], login);
router.post('/google', [], googleSignIn);
router.post('/facebook', [], facebookSignIn);
router.post('/restore', [
    validateJWT,
    isAdminOrOwner,
    check('email', 'Invalid email.').isEmail(),
    check('password', 'Password length should be more than 6 characteres.').isLength({ min: 6 }),
    check('email').custom(userByEmailNotExists)
], restorePassword);
export default router;
