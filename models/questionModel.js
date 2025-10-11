import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length === 4,
        "Each question must have exactly 4 options.",
      ],
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      default: 1,
      min: 1,
    },
    subject: {
      type: String,
      default: "General",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    explanation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🧠 Index for faster queries (especially by testId)
questionSchema.index({ testId: 1 });

const Question = mongoose.model("Question", questionSchema);

export default Question;