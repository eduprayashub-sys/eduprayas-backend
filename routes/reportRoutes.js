import express from "express";
import { sendResultReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-report", protect, sendResultReport);

export default router;
