// backend/routes/attemptRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { submitAttempt, getAttemptsByUser } from "../controllers/attemptController.js";

const router = express.Router();

// ✅ All attempt routes are protected
router.use(protect);

// 📤 Submit a test attempt
router.post("/", submitAttempt);

// 📥 Get all attempts for the logged-in user
router.get("/", getAttemptsByUser);

export default router;
