import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
} from "../controllers/testController.js";

const router = express.Router();

// Routes
router.get("/", protect, getAllTests);          // ✅ Logged-in users
router.get("/:id", protect, getTestById);
router.post("/", protect, adminOnly, createTest);
router.put("/:id", protect, adminOnly, updateTest);
router.delete("/:id", protect, adminOnly, deleteTest);

export default router;
