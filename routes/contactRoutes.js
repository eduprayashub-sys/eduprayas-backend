import express from "express";
import {
  submitContactForm,
  getAllMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   📩 PUBLIC CONTACT ROUTE
================================ */

// 🌐 Anyone can send a contact form message
router.post("/", submitContactForm);

/* ================================
   👑 ADMIN CONTACT MANAGEMENT
================================ */

// 📋 Get all messages (Admin only)
router.get("/messages", protect, adminOnly, getAllMessages);

// ❌ Delete a message (Admin only)
router.delete("/messages/:id", protect, adminOnly, deleteMessage);

export default router;
