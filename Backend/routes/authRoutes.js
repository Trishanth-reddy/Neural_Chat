import express from "express";
import { signup, login, logout, getMe } from "../controllers/userController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { signupValidationRules, loginValidationRules, validate } from "../middleware/validator.js";

const router = express.Router();

router.post("/signup",  signupValidationRules(), validate, signup);
router.post("/login",  loginValidationRules(), validate, login);
router.post("/logout", protectRoute, logout);
router.get("/me", protectRoute, getMe);

export default router;