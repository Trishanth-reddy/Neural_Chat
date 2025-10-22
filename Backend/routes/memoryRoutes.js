import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { saveMemory, getMemory, processPdf } from "../controllers/memoryController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();  // in-memory storage

router.post("/processPdf", protectRoute, upload.single("pdf"), processPdf);
router.post("/saveMemory", protectRoute, saveMemory);
router.get("/", protectRoute, getMemory);

export default router;
