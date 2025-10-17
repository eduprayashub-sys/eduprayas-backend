console.log("✅ authRoutes file loaded");
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updatePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📝 Register a new user
router.post("/register", registerUser);

// 🔑 Login user
router.post("/login", loginUser);

// 👤 Get logged-in user's profile
router.get("/profile", protect, getUserProfile);

// 🔄 Update password (protected route)
router.put("/update-password", protect, updatePassword);

export default router;
