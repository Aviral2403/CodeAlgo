const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    titleSm: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], // Better to specify that it's an array of strings
    },
    titleBg: {
      type: String,
      required: true,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    example: {
      type: [String],
      required: true,
    },
    bruteIntuition: {
      type: String,
    },
    bruteApproach: {
      type: String,
    },
    bruteTime: {
      type: String,
    },
    bruteSpace: {
      type: String,
    },
    betterIntuition: {
      type: String,
    },
    betterApproach: {
      type: String,
    },
    betterTime: {
      type: String,
    },
    betterSpace: {
      type: String,
    },
    optimalIntuition: {
      type: String,
    },
    optimalApproach: {
      type: String,
    },
    optimalTime: {
      type: String,
    },
    optimalSpace: {
      type: String,
    },
    optimalDryRun: {
      type: String,
    },
    videoLink: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
