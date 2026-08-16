import { Router } from "express"
import { addShowWatchList,getShowWatchList,updateWatchList,deleteWatchList } from "../controllers/watchlistShow.controller.js"
import { authMiddleware } from '../middleware/authTokens.js';
const router = Router();

router.use(authMiddleware);
router.post('/watchListShow', addShowWatchList);
router.get('/watchListShow',getShowWatchList);
router.patch('/watchListShow/:showId',updateWatchList);
router.delete('/watchListShow/:showId', deleteWatchList)

export default router