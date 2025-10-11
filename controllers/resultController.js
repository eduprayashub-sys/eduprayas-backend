import Result from "../models/resultModel.js";
import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";
import User from "../models/userModel.js";

// ✅ Submit Test and Calculate Result
export const submitTest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { testId, answers } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const questions = await Question.find({ testId });
    if (!questions || questions.length === 0)
      return res.status(404).json({ message: "No questions found for this test" });

    let score = 0;
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    // 🧮 Calculate Score
    questions.forEach((q) => {
      if (answers[q._id] && answers[q._id] === q.correctAnswer) {
        score += q.marks;
      }
    });

    const percentage = ((score / totalMarks) * 100).toFixed(2);

    // 💾 Save Result
    const result = new Result({
      userId,
      testId,
      score,
      totalMarks,
      percentage,
      answers,
    });
    await result.save();

    res.status(201).json({
      message: "✅ Test submitted successfully",
      result,
    });
  } catch (error) {
    console.error("❌ Error submitting test:", error);
    res.status(500).json({ message: "Server error while submitting test" });
  }
};

// 📊 Get All or User-Specific Results
export const getResults = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let results;
    if (user.email === "eduprayashub@gmail.com") {
      // 👑 Admin sees all
      results = await Result.find()
        .populate("userId", "name email")
        .populate("testId", "title category");
    } else {
      // 👤 Student sees own results
      results = await Result.find({ userId: req.user.id })
        .populate("testId", "title category");
    }

    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching results:", error);
    res.status(500).json({ message: "Error fetching results" });
  }
};

// 🧾 Get Single Result by ID
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("userId", "name email")
      .populate("testId", "title category");

    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching result:", error);
    res.status(500).json({ message: "Error fetching result" });
  }
};
