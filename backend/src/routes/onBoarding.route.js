import { Router } from 'express'
import { getOnBoarding } from "../controllers/onBoarding.controller.js"
import { authMiddleware } from '../middleware/authTokens.js';
const router = Router();

router.use(authMiddleware);
router.get('/getOnBoarding', getOnBoarding);


export default router