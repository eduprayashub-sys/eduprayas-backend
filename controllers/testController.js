import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";

/**
 * @desc   Get all tests
 * @route  GET /api/tests
 * @access Private (Admin or Student)
 */
// ✅ Get All Tests
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate("questions", "question options correctAnswer");
    res.json(tests);
  } catch (error) {
    console.error("❌ Error fetching tests:", error);
    res.status(500).json({ message: "Server error while fetching tests" });
  }
};

/**
 * @desc   Get a single test by ID (with questions)
 * @route  GET /api/tests/:id
 * @access Private
 */
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("questions");
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    console.error("❌ Error fetching test:", error);
    res.status(500).json({ message: "Server error fetching test" });
  }
};

/**
 * @desc   Create new test
 * @route  POST /api/tests
 * @access Private (Admin only)
 */
export const createTest = async (req, res) => {
  try {
    const { title, category, duration, totalMarks } = req.body;

    if (!title || !category || !duration || !totalMarks) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTest = await Test.create({
      title,
      category,
      duration,
      totalMarks,
      createdBy: req.user.id,
    });

    res.status(201).json(newTest);
  } catch (error) {
    console.error("❌ Error creating test:", error);
    res.status(500).json({ message: "Server error creating test" });
  }
};

/**
 * @desc   Update a test
 * @route  PUT /api/tests/:id
 * @access Private (Admin only)
 */
export const updateTest = async (req, res) => {
  try {
    const { title, category, duration, totalMarks } = req.body;
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    test.title = title || test.title;
    test.category = category || test.category;
    test.duration = duration || test.duration;
    test.totalMarks = totalMarks || test.totalMarks;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } catch (error) {
    console.error("❌ Error updating test:", error);
    res.status(500).json({ message: "Server error updating test" });
  }
};

/**
 * @desc   Delete a test
 * @route  DELETE /api/tests/:id
 * @access Private (Admin only)
 */
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    await test.deleteOne();
    res.json({ message: "🗑️ Test deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting test:", error);
    res.status(500).json({ message: "Server error deleting test" });
  }
};

/**
 * @desc   Assign question to a test
 * @route  POST /api/tests/:id/add-question
 * @access Private (Admin only)
 */
export const addQuestionToTest = async (req, res) => {
  try {
    const { questionId } = req.body;
    const test = await Test.findById(req.params.id);
    const question = await Question.findById(questionId);

    if (!test || !question) {
      return res.status(404).json({ message: "Test or Question not found" });
    }

    if (!test.questions.includes(questionId)) {
      test.questions.push(questionId);
      await test.save();
    }

    res.json({ message: "✅ Question added to test successfully" });
  } catch (error) {
    console.error("❌ Error adding question:", error);
    res.status(500).json({ message: "Server error adding question" });
  }
};
