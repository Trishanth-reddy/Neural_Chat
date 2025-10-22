// Backend/controllers/userController.js
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper function to generate and set JWT token in cookie
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  return token;
};

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username: username.toLowerCase() }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email or username already exists." 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Send response
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });

  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// LOGIN CONTROLLER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Send response
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// LOGOUT CONTROLLER
export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET CURRENT USER CONTROLLER
export const getMe = async (req, res) => {
  try {
    // req.user is set by protectRoute middleware
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
    
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
