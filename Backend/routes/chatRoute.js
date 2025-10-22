import express from "express";
import { streamChatCompletion, getChatById } from "../controllers/chatController.js";
// import { protect } from "../middleware/authMiddleware.js"; // Optional: Add auth middleware

const router = express.Router();

// Route to handle sending a message and getting a streamed response
// This will create a new chat or add to an existing one.
router.post("/stream", streamChatCompletion);

// Route to get a specific chat and its full message history
router.get("/:chatId", getChatById);

export default router;
