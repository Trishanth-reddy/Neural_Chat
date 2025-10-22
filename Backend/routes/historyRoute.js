import express from 'express';
import { getUserHistoryDetails } from '../controllers/historyController.js';
// import { protectRoute } from '../middleware/authMiddleware.js'; // Optional: Add auth middleware

const router = express.Router();

// This single route provides all the formatted data for the history page.
router.get('/:userId', getUserHistoryDetails);

export default router;
