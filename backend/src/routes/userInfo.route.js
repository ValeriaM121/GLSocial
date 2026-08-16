import { Router } from 'express'
import{ getUsername, getEmail, updateUsername, updateEmail, updatePassword,updateOnboarding } from '../controllers/userInfo.controller.js'
import { authMiddleware } from '../middleware/authTokens.js';
import { APILimit } from '../middleware/rateLimiters.js';
const router = Router();

router.use(authMiddleware, APILimit);

router.get('/getUsername', getUsername);
router.get('/getEmail', getEmail);
//router.get('/getId', getId);//I don't think i need this
router.patch('/updateUsername', updateUsername);
router.patch('/updateEmail', updateEmail);
router.patch('/updatePassword', updatePassword);
router.patch('/updateCompletedOnboarding', updateOnboarding);

export default router