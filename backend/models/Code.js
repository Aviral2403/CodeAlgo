const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
  // Existing fields
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
    index: true
  },
  problemDesc: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Problem description cannot be empty."
    }
  },
  input: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Input list cannot be empty."
    }
  },
  output: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Output list cannot be empty."
    }
  },
  explanation: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Explanation list cannot be empty."
    }
  },
  constraints: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Constraints list cannot be empty."
    }
  },
  
  starterTemplates: {
    type: Map,
    of: String,
    default: {} 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Code", CodeSchema);