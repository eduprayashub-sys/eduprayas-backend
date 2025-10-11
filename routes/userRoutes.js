import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  resetPassword,
  toggleRole,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👑 Admin-only access for all user management routes
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id", protect, adminOnly, updateUser);
router.put("/users/reset-password/:id", protect, adminOnly, resetPassword);
router.put("/users/toggle-role/:id", protect, adminOnly, toggleRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
