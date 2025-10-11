import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  resetPassword,
  toggleRole,
} from "../controllers/userController.js";

import {
  getAllTests,
  createTest,
  updateTest,
  deleteTest,
} from "../controllers/testController.js";

import {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   👑 ADMIN USER MANAGEMENT ROUTES
================================= */

// 📋 Get all users
router.get("/users", protect, adminOnly, getAllUsers);

// ✏ Update a user
router.put("/users/:id", protect, adminOnly, updateUser);

// 🔐 Reset a user’s password
router.put("/users/reset-password/:id", protect, adminOnly, resetPassword);

// 🔁 Toggle user role (student <-> admin)
router.put("/users/toggle-role/:id", protect, adminOnly, toggleRole);

// 🗑 Delete user
router.delete("/users/:id", protect, adminOnly, deleteUser);


/* ================================
   🧾 ADMIN TEST MANAGEMENT ROUTES
================================= */

// 📋 Get all tests
router.get("/tests", protect, adminOnly, getAllTests);

// ➕ Create test
router.post("/tests", protect, adminOnly, createTest);

// ✏ Update test
router.put("/tests/:id", protect, adminOnly, updateTest);

// ❌ Delete test
router.delete("/tests/:id", protect, adminOnly, deleteTest);


/* ================================
   🧠 ADMIN QUESTION MANAGEMENT
================================= */

// 📋 Get all questions
router.get("/questions", protect, adminOnly, getAllQuestions);

// ➕ Create question
router.post("/questions", protect, adminOnly, createQuestion);

// ✏ Update question
router.put("/questions/:id", protect, adminOnly, updateQuestion);

// ❌ Delete question
router.delete("/questions/:id", protect, adminOnly, deleteQuestion);

/* ================================
   💬 CONTACT FORM ROUTES
================================ */
import { submitContactForm, getAllContacts } from "../controllers/contactController.js";

// 🌐 Public route — anyone can send a message
router.post("/contact", submitContactForm);

// 👑 Admin route — only admin can view messages
router.get("/contacts", protect, adminOnly, getAllContacts);

// 📁 routes/adminRoutes.js
import { getAllMessages, markMessageAsRead } from "../controllers/contactController.js";

// Get all messages (admin only)
router.get("/messages", protect, adminOnly, getAllMessages);

// Mark as read (optional)
router.put("/messages/:id/read", protect, adminOnly, markMessageAsRead);
router.delete("/messages/:id", protect, adminOnly, deleteMessage);
export default router; 
