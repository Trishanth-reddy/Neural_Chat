import express from "express";
import { streamChatCompletion, getChatById } from "../controllers/chatController.js";
// IMPORT the middleware
import { protectRoute } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Apply protectRoute so req.user is available
router.post("/stream", protectRoute, streamChatCompletion);

// Apply protectRoute so users can only see their own chats
router.get("/:chatId", protectRoute, getChatById);

export default router;