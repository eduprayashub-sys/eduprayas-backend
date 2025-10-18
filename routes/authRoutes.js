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

// 🧪 Simple test route to check API connection
router.get("/test", (req, res) => {
  res.json({ message: "Eduprayas backend is live and connected!" });
});


// 📝 Register a new user
router.post("/register", registerUser);

// 🔑 Login user
router.post("/login", loginUser);

// 👤 Get logged-in user's profile
router.get("/profile", protect, getUserProfile);

// 🔄 Update password (protected route)
router.put("/update-password", protect, updatePassword);

export default router;
