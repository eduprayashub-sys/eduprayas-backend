import Question from "../models/questionModel.js";
import Test from "../models/testModel.js";

// 🟢 Create Question
export const createQuestion = async (req, res) => {
  try {
    const { testId, question, options, correctAnswer, marks, subject, difficulty } = req.body;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const newQuestion = new Question({
      testId,
      question,
      options,
      correctAnswer,
      marks,
      subject,
      difficulty,
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question created successfully", newQuestion });
  } catch (error) {
    console.error("❌ Error creating question:", error);
    res.status(500).json({ message: "Server error creating question" });
  }
};

// 🟢 Get All Questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("testId", "title category");
    res.status(200).json(questions);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({ message: "Server error fetching questions" });
  }
};

// 🟢 Get Questions by Test ID
export const getQuestionsByTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const questions = await Question.find({ testId });
    res.status(200).json(questions);
  } catch (error) {
    console.error("❌ Error fetching test questions:", error);
    res.status(500).json({ message: "Server error fetching test questions" });
  }
};

// 🟢 Update Question
export const updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.status(200).json({ message: "Question updated successfully", updated });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    res.status(500).json({ message: "Server error updating question" });
  }
};

// 🟢 Delete Question
export const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Question not found" });
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting question:", error);
    res.status(500).json({ message: "Server error deleting question" });
  }
};