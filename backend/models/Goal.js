const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  goals: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 }
  }
});

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;