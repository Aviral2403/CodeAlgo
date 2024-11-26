const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const Submission = require("../models/Submission");

// Set a goal
router.post("/set-goal", async (req, res) => {
  const { userId, targetDate, goals } = req.body;
  
  try {
    // Check if a goal already exists for this date
    let goal = await Goal.findOne({ 
      userId, 
      targetDate: {
        $gte: new Date(targetDate).setHours(0, 0, 0, 0),
        $lt: new Date(targetDate).setHours(23, 59, 59, 999)
      }
    });

    if (goal) {
      // Update existing goal
      goal.goals = goals;
      await goal.save();
    } else {
      // Create new goal
      goal = new Goal({ 
        userId, 
        targetDate: new Date(targetDate), 
        goals 
      });
      await goal.save();
    }

    res.status(200).json({ success: true, message: "Goal set successfully", goal });
  } catch (error) {
    console.error("Error setting goal:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error setting goal", 
      error: error.message 
    });
  }
});

// Get goals for a specific date
router.get("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  try {
    const goal = await Goal.findOne({ 
      userId, 
      targetDate: { $gte: startOfDay, $lte: endOfDay } 
    });

    // If no goal is set, return a default object with zero goals
    if (!goal) {
      return res.status(200).json({ goals: null });
    }

    // Get submissions for the day to provide context
    const submissions = await Submission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          submissionDate: { $gte: startOfDay, $lte: endOfDay },
          isCompleted: true
        }
      },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "question"
        }
      },
      { $unwind: "$question" },
      {
        $group: {
          _id: "$question.difficulty",
          count: { $sum: 1 }
        }
      }
    ]);

    // Restructure submissions for easy access
    const submissionCounts = {
      easy: submissions.find(s => s._id === 'easy')?.count || 0,
      medium: submissions.find(s => s._id === 'medium')?.count || 0,
      hard: submissions.find(s => s._id === 'hard')?.count || 0
    };

    res.status(200).json({ 
      goals: goal.goals,
      submissions: submissionCounts
    });
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching goal", 
      error: error.message 
    });
  }
});



router.get("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  try {
    const goal = await Goal.findOne({ 
      userId, 
      targetDate: { $gte: startOfDay, $lte: endOfDay } 
    });

    // Get submissions for the day
    const submissions = await Submission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          submissionDate: { $gte: startOfDay, $lte: endOfDay },
          isCompleted: true
        }
      },
      {
        $lookup: {
          from: "questions",
          localField: "questionId",
          foreignField: "_id",
          as: "question"
        }
      },
      { $unwind: "$question" },
      {
        $group: {
          _id: "$question.difficulty",
          count: { $sum: 1 }
        }
      }
    ]);

    const submissionCounts = {
      easy: submissions.find(s => s._id === 'easy')?.count || 0,
      medium: submissions.find(s => s._id === 'medium')?.count || 0,
      hard: submissions.find(s => s._id === 'hard')?.count || 0
    };

    // Get total submissions (both complete and incomplete)
    const totalSubmissions = await Submission.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      submissionDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const incompleteSubmissions = await Submission.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      submissionDate: { $gte: startOfDay, $lte: endOfDay },
      isCompleted: false
    });

    res.status(200).json({ 
      goals: goal?.goals || null,
      submissions: submissionCounts,
      totalSubmissions: {
        completed: totalSubmissions - incompleteSubmissions,
        incomplete: incompleteSubmissions
      }
    });
  } catch (error) {
    console.error("Error fetching goal:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching goal", 
      error: error.message 
    });
  }
});



module.exports = router;




