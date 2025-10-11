import express from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionsByTest,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin
router.post("/bulk", protect, adminOnly, createQuestion);
router.get("/", protect, adminOnly, getAllQuestions);
router.put("/:id", protect, adminOnly, updateQuestion);
router.delete("/:id", protect, adminOnly, deleteQuestion);

// Student
router.get("/test/:testId", protect, getQuestionsByTest);

export default router;
