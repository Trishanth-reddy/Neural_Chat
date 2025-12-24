// Backend/index.js (or server.js)

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import { connectToDB } from "./utils/db.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/authMiddleware.js";
import chatRoute from "./routes/chatRoute.js";
import historyRoute from "./routes/historyRoute.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

dotenv.config();

const app = express();

// --- FIX 1: TRUST RENDER'S PROXY ---
// This tells Express to trust the X-Forwarded-For header from Render.
// It MUST come before you use rateLimit or cors.
app.set('trust proxy', 1); 

// Rate limiter for all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again after 15 minutes" },
});
app.use("/api", apiLimiter);

// Security middlewares
app.use(helmet());
app.use(compression());

// Cookie parser must come before CORS when credentials are involved
app.use(cookieParser());

// --- FIX 2: CORRECT CORS CONFIGURATION ---
// Define origins as a proper array
const allowedOrigins = [
  process.env.FRONTEND_URL, // This should be 'https://neural-chat-sooty.vercel.app'
  "http://localhost:5173",
  "https://neural-chat-sooty.vercel.app"  
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman) or from our list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// --- END OF FIXES ---

// JSON body parsing
app.use(express.json({ limit: "5mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});


// API routes
app.use("/api/auth/v1", authRoutes);
app.use("/api/memory/v1", protectRoute, memoryRoutes);
app.use("/api/chat/v1", protectRoute, chatRoute);
app.use("/api/history/v1", protectRoute, historyRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Start server and connect to DB
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  connectToDB();
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;