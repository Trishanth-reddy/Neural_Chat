import express from 'express';
import { getUserHistoryDetails } from '../controllers/historyController.js';
// IMPORT the middleware
import { protectRoute } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// CRITICAL: Protect this route. 
// Otherwise, anyone can see anyone else's history by guessing the ID.
router.get('/:userId', protectRoute, getUserHistoryDetails);

export default router;