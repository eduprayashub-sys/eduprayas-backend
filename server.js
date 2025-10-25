import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// 🧩 Import Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
const app = express();

// ✅ Use JSON Parser + Logger
app.use(express.json());
app.use(morgan("dev"));

// ✅ Enable CORS (Render + Local)
app.use(
  cors({
    origin: [
      "https://eduprayas-frontend.vercel.app", // 🔹 Your deployed frontend
      "http://localhost:5173", // 🔹 Local dev frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Connect MongoDB
connectDB();

// ✅ Debug Logs (for Render)
console.log("✅ authRoutes file loaded");
console.log("🧭 Mounting API routes...");

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", statsRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 EduPrayas API is running successfully!");
});

// ✅ 404 Route Handler
app.use((req, res) => {
  console.log("❌ 404 - Route not found:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
