const express = require("express");
const router = express.Router();
const Question = require('../models/Question');

router.post('/create', async (req, res) => {
  try {
    const newQuestion = new Question({
      number: req.body.number,
      titleSm: req.body.titleSm,
      difficulty: req.body.difficulty,
      tags: req.body.tags,
      titleBg: req.body.titleBg,
      problemStatement: req.body.problemStatement,
      note: req.body.note,
      example: req.body.example,
      bruteIntuition: req.body.bruteIntuition,
      bruteApproach: req.body.bruteApproach,
      bruteTime: req.body.bruteTime,
      bruteSpace: req.body.bruteSpace,
      betterIntuition: req.body.betterIntuition,
      betterApproach: req.body.betterApproach,
      betterTime: req.body.betterTime,
      betterSpace: req.body.betterSpace,
      optimalIntuition: req.body.optimalIntuition,
      optimalApproach: req.body.optimalApproach,
      optimalTime: req.body.optimalTime,
      optimalSpace: req.body.optimalSpace,
      optimalDryRun: req.body.optimalDryRun,
      videoLink: req.body.videoLink
    });

    const savedQuestion = await newQuestion.save();
    res.status(200).json(savedQuestion);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// New search endpoint
router.get("/search", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        const allQuestions = await Question.find();
        return res.status(200).json(allQuestions);
      }
  
      const searchFilter = [
        { titleSm: { $regex: query, $options: "i" } },
        { difficulty: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { number: { $regex: query, $options: "i" } }
      ];
  
      const questions = await Question.find({ $or: searchFilter });
      res.status(200).json(questions);
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Search failed", details: err.message });
    }
  });

router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;