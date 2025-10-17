import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

// 🛠 Route Imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// ⚙️ Load .env
dotenv.config();

// 🚀 Initialize Express App
const app = express();

// ✅ CORS Configuration (Frontend + Local)
app.use(
  cors({
    origin: [
      "https://eduprayas-frontend.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🧱 Middleware
app.use(express.json());
app.use(morgan("dev"));

// ✅ Connect Database
connectDB();

// 🧭 Base Route
app.get("/", (req, res) => {
  res.send("🚀 EduPrayas API is running successfully!");
});

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Test route working fine!" });
});

// 🧩 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", statsRoutes);
app.use("/api/contact", contactRoutes);

// 🧨 404 Fallback Route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ⚡ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
