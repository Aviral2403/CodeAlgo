const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema(
  {
    // Reference to the associated question
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", // Must match the name of the Question model
      required: true,
      index: true, // Index to optimize queries based on questionId
    },
    // Problem description paragraphs or points
    problemDesc: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Problem description cannot be empty.",
      },
    },
    // Inputs for the problem
    input: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Input list cannot be empty.",
      },
    },
    // Expected outputs for the problem
    output: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Output list cannot be empty.",
      },
    },
    // Explanations or solutions for the problem
    explanation: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Explanation list cannot be empty.",
      },
    },
    // Constraints or conditions for the problem
    constraints: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Constraints list cannot be empty.",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Code", CodeSchema);
