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

// ⚙️ Environment Config
dotenv.config();

// 🚀 Initialize Express App
const app = express();

// ✅ CORS Middleware (Fix for Render + Vercel)
app.use(
  cors({
    origin: [
      "https://eduprayas-frontend-wunb.vercel.app", // ✅ Your main frontend link
      "http://localhost:5173"                  // ✅ Local testing (optional)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors()); // ✅ Handles preflight requests (important)

// ✅ Middleware
app.use(express.json());
app.use(morgan("dev"));

// ✅ Connect MongoDB
connectDB();

// 🧭 Base Route (Health Check)
app.get("/", (req, res) => {
  res.send("🚀 EduPrayas API is running successfully!");
});

// ✅ All API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", statsRoutes);
app.use("/api/contact", contactRoutes);

// 🧨 404 Fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ⚡ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
