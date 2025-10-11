import User from "../models/userModel.js";
import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";
import Result from "../models/resultModel.js";
import jwt from "jsonwebtoken";

// 📊 Fetch Stats for Dashboard (Admin or Student)
export const getDashboardStats = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    // 👑 ADMIN DASHBOARD DATA
    if (userEmail === "eduprayashub@gmail.com") {
      const users = await User.countDocuments();
      const tests = await Test.countDocuments();
      const questions = await Question.countDocuments();
      const results = await Result.countDocuments();

      // Generate chart data (mock example by day)
      const activity = [
        { date: "Mon", users: 10, tests: 5 },
        { date: "Tue", users: 20, tests: 8 },
        { date: "Wed", users: 5, tests: 4 },
        { date: "Thu", users: 15, tests: 6 },
        { date: "Fri", users: 25, tests: 12 },
      ];

      return res.json({
        role: "admin",
        stats: { users, tests, questions, results },
        activity,
      });
    }

    // 👤 STUDENT DASHBOARD DATA
    const userId = decoded.id;
    const totalTests = await Test.countDocuments();
    const results = await Result.find({ userId });

    const myTests = results.length;
    const avgScore =
      results.length > 0
        ? (
            results.reduce((sum, r) => sum + r.percentage, 0) / results.length
          ).toFixed(1)
        : 0;
    const bestScore =
      results.length > 0
        ? Math.max(...results.map((r) => r.percentage)).toFixed(1)
        : 0;

    // Chart data from recent results
    const activity = results.slice(-6).map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      percentage: r.percentage,
      tests: 1,
    }));

    res.json({
      role: "student",
      stats: { myTests, avgScore, bestScore, tests: totalTests },
      activity,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
};
