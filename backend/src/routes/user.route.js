import { Router } from "express"
import { registerUser, loginUser, logoutUser, googleLogin, forgotPassword,changePassword, refreshToken, openResetPassword} from "../controllers/user.controller.js"
import { verifyGoogleTokens } from "../middleware/authGoogleTokens.js"
import { authMiddleware } from '../middleware/authTokens.js';
import { LoginLimit, RegisterLimit, ForgotPasswordLimit, GoogleLimit, ChangePasswordLimit } from "../middleware/rateLimiters.js";
const router = Router();


router.post('/register', RegisterLimit, registerUser);
router.post('/login', LoginLimit, loginUser);
router.post('/logout', logoutUser);//check method if it's GET or POST Probably should be put in userInfo.route.js
router.post('/loginGoogle', GoogleLimit, verifyGoogleTokens, googleLogin);
router.post('/forgotPassword', ForgotPasswordLimit, forgotPassword );
router.patch('/changePassword', ChangePasswordLimit, changePassword);
router.post('/refreshToken', refreshToken);
router.get('/resetPassword', openResetPassword);
export default router