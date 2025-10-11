import Attempt from "../models/attemptModel.js";
import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";

// 📤 Submit a Test Attempt
export const submitAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { testId, answers } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const questions = await Question.find({ testId });
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this test" });
    }

    // ✅ Calculate score
    let score = 0;
    let totalMarks = 0;

    questions.forEach((q) => {
      totalMarks += q.marks;
      if (answers[q._id] && answers[q._id] === q.correctAnswer) {
        score += q.marks;
      }
    });

    const percentage = ((score / totalMarks) * 100).toFixed(2);

    // ✅ Save attempt in DB
    const attempt = new Attempt({
      userId,
      testId,
      score,
      totalMarks,
      percentage,
      answers,
    });

    await attempt.save();

    res.status(201).json({
      message: "✅ Attempt submitted successfully",
      attempt,
    });
  } catch (error) {
    console.error("❌ Error submitting attempt:", error);
    res.status(500).json({ message: "Server error while submitting attempt" });
  }
};

// 📥 Get all attempts by logged-in user
export const getAttemptsByUser = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate("testId", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json(attempts);
  } catch (error) {
    console.error("❌ Error fetching attempts:", error);
    res.status(500).json({ message: "Error fetching attempts" });
  }
};
