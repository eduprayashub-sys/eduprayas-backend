import express from "express";
import {
  submitContactForm,
  getAllMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public contact form
router.post("/", submitContactForm);

// Admin-only routes
router.get("/", protect, adminOnly, getAllMessages);
router.delete("/:id", protect, adminOnly, deleteMessage);

export default router;
