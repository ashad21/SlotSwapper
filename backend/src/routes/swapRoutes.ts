import express from 'express';
import {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getMySwapRequests,
  cancelSwapRequest
} from '../controllers/swapController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/swappable-slots', getSwappableSlots);
router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:requestId', respondToSwapRequest);
router.delete('/swap-request/:requestId', cancelSwapRequest);
router.get('/my-requests', getMySwapRequests);

export default router;
