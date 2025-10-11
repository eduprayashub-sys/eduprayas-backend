import express from "express";
import {
  submitTest,
  getResults,
  getResultById,
} from "../controllers/resultController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitTest);
router.get("/", protect, getResults);
router.get("/:id", protect, getResultById);

export default router;
