import User from "../models/userModel.js";
import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";
import Result from "../models/resultModel.js";

// 🎯 Admin Dashboard Stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTests = await Test.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalResults = await Result.countDocuments();

    // Optional: Activity data for charts
    const recentResults = await Result.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("testId", "title");

    const activity = recentResults.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString(),
      users: 1,
      tests: 1,
    }));

    res.json({
      success: true,
      stats: {
        users: totalUsers,
        tests: totalTests,
        questions: totalQuestions,
        results: totalResults,
      },
      activity,
    });
  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};
