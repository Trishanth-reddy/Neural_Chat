import express from "express";
import { signup, login, logout, getMe } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);
router.get("/me", protectRoute, getMe);

export default router;