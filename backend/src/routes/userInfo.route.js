import { Router } from 'express'
import{ getUsername, getEmail, updateUsername, updateEmail, updatePassword} from '../controllers/userInfo.controller.js'
import { authMiddleware } from '../middleware/authTokens.js';
const router = Router();

router.use(authMiddleware);

router.get('/getUsername', getUsername);
router.get('/getEmail', getEmail);
//router.get('/getId', getId);//I don't think i need this
router.patch('/updateUsername', updateUsername);
router.patch('/updateEmail', updateEmail);
router.patch('/updatePassword', updatePassword);

export default router