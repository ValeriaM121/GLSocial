import { Router } from "express"
import { registerUser, loginUser, logoutUser, googleLogin, forgotPassword,changePassword, refreshToken} from "../controllers/user.controller.js"
import { verifyGoogleTokens } from "../middleware/authGoogleTokens.js"
import { authMiddleware } from '../middleware/authTokens.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);//check method if it's GET or POST Probably should be put in userInfo.route.js
router.post('/loginGoogle', verifyGoogleTokens, googleLogin);
router.post('/forgotPassword', forgotPassword );
router.patch('/changePassword', changePassword);
router.post('/refreshToken', refreshToken);
//router.get('/reset-password', openResetPassword);
export default router