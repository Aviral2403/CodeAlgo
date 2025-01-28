const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Question = require("../models/Question");
const Code = require("../models/Code");
const CodeSubmission = require('../models/CodeSubmission');
const axios = require('axios');


// POST route for submitting a solution
router.post("/submit", async (req, res) => {
  const { userId, questionId, isCompleted } = req.body;

  try {
    let submission = await Submission.findOne({ userId, questionId });

    if (submission) {
      submission.isCompleted = isCompleted;
      submission.submissionDate = Date.now();
      await submission.save();
    } else {
      submission = new Submission({
        userId,
        questionId,
        isCompleted,
        submissionDate: Date.now(),
      });
      await submission.save();
    }

    res.status(200).json({
      success: true,
      message: "Submission recorded successfully",
      submission,
    });
  } catch (error) {
    console.error("Error during submission:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting solution",
      error: error.message,
    });
  }
});

// GET route to fetch all submissions for a user
router.get("/submissions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await Submission.find({ userId })
      .populate("questionId")
      .sort({ submissionDate: -1 });

    res.status(200).json({
      success: true,
      data: submissions || [],
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error: error.message,
    });
  }
});

router.get("/submissions-summary/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch total number of questions for each difficulty
    const totalQuestions = await Question.aggregate([
      { $group: { _id: "$difficulty", total: { $sum: 1 } } },
      { $project: { difficulty: "$_id", total: 1, _id: 0 } },
    ]);

    // Initialize default response structure
    const result = {
      completed: { easy: 0, medium: 0, hard: 0 },
      incomplete: { easy: 0, medium: 0, hard: 0 },
      unattempted: { easy: 0, medium: 0, hard: 0 },
    };

    // Get submission counts only if there are submissions
    const submissionExists = await Submission.exists({ userId: new mongoose.Types.ObjectId(userId) });

    if (submissionExists) {
      const submissionsSummary = await Submission.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: "questions",
            localField: "questionId",
            foreignField: "_id",
            as: "question",
          },
        },
        { $unwind: "$question" },
        {
          $group: {
            _id: {
              difficulty: "$question.difficulty",
              isCompleted: "$isCompleted",
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            difficulty: "$_id.difficulty",
            isCompleted: "$_id.isCompleted",
            count: 1,
            _id: 0,
          },
        },
      ]);

      // Populate result based on submissions summary
      submissionsSummary.forEach((submission) => {
        if (submission.isCompleted) {
          result.completed[submission.difficulty.toLowerCase()] = submission.count;
        } else {
          result.incomplete[submission.difficulty.toLowerCase()] = submission.count;
        }
      });
    }

    // Calculate unattempted questions
    totalQuestions.forEach((question) => {
      const difficulty = question.difficulty.toLowerCase();
      const total = question.total;
      const attempted = result.completed[difficulty] + result.incomplete[difficulty];
      result.unattempted[difficulty] = total - attempted;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching submission summary:", error);
    res.status(500).json({
      message: "Error fetching submission summary",
      error: error.message,
    });
  }
});

router.get("/latest-submissions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const latestSubmissions = await Submission.find({ userId })
      .populate("questionId")
      .sort({ submissionDate: -1 })
      .limit(10)
      .select("questionId isCompleted submissionDate");

    // Always return 200 with submissions array (empty if none found)
    const formattedSubmissions = latestSubmissions.map((submission) => ({
      questionId: submission.questionId,
      isCompleted: submission.isCompleted,
      submissionDate: submission.submissionDate.toISOString().split("T")[0],
    }));

    res.status(200).json(formattedSubmissions);
  } catch (error) {
    console.error("Error fetching latest submissions:", error);
    res.status(500).json({
      message: "Error fetching latest submissions",
      error: error.message,
    });
  }
});

router.get("/submission-dates/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await Submission.find({ userId }).select(
      "submissionDate isCompleted"
    );

    const submissionDates = submissions.map((submission) => ({
      date: submission.submissionDate.toISOString().split("T")[0],
      isCompleted: submission.isCompleted,
    }));

    res.status(200).json(submissionDates);
  } catch (error) {
    console.error("Error fetching submission dates:", error);
    res.status(500).json({
      message: "Error fetching submission dates",
      error: error.message,
    });
  }
});

router.get("/submissions-on-date/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;

  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  try {
    const submissionsOnDate = await Submission.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          submissionDate: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$isCompleted",
          count: { $sum: 1 },
        },
      },
    ]);

    // Always return default values if no submissions
    const result = {
      completed: 0,
      incomplete: 0,
    };

    submissionsOnDate.forEach((submission) => {
      if (submission._id) {
        result.completed = submission.count;
      } else {
        result.incomplete = submission.count;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching submissions on date:", error);
    res.status(500).json({
      message: "Error fetching submissions on date",
      error: error.message,
    });
  }
});



router.get("/status/:userId/:questionId", async (req, res) => {
  const { userId, questionId } = req.params;

  try {
    const submission = await Submission.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      questionId: new mongoose.Types.ObjectId(questionId)
    });

    let status = "unattempted";
    if (submission) {
      status = submission.isCompleted ? "completed" : "attempting";
    }

    res.status(200).json({
      success: true,
      status
    });
  } catch (error) {
    console.error("Error fetching submission status:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching submission status",
      error: error.message
    });
  }
});




const JUDGE0_API_KEY = '7a03227291msh98ef5b89026fda4p1ed3eejsnf61cbab0b3fc';
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

// Helper function to map programming languages to Judge0 language IDs
function getJudge0LanguageId(language) {
  const languageMap = {
    'javascript': 63,  // Node.js
    'python': 71,      // Python 3
    'java': 62,        // Java
    'cpp': 54,         // C++
    'c': 50           // C
  };
  return languageMap[language.toLowerCase()] || 63;
}

// Code submission endpoint
router.post("/submit-code", async (req, res) => {
  const { code, language, questionId, userId, testCaseIndex } = req.body;

  try {
    // Decode base64 code
    const decodedCode = Buffer.from(code, 'base64').toString();

    // Validate inputs
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const codeDoc = await Code.findOne({ questionId });
    if (!codeDoc) {
      return res.status(404).json({ message: "Test cases not found" });
    }

    // Validate test cases
    if (!Array.isArray(codeDoc.input) || !Array.isArray(codeDoc.output) || 
        codeDoc.input.length === 0 || codeDoc.output.length === 0 || 
        codeDoc.input.length !== codeDoc.output.length) {
      return res.status(400).json({ message: "Invalid test cases format" });
    }

    const languageId = getJudge0LanguageId(language);
    let allTestsPassed = true;
    let executionResults = [];
    
    // Determine test cases to run
    const testCasesToRun = testCaseIndex !== undefined 
      ? [{ input: codeDoc.input[testCaseIndex], output: codeDoc.output[testCaseIndex] }]
      : codeDoc.input.map((input, idx) => ({
          input: input,
          output: codeDoc.output[idx]
        }));

    // Process each test case
    for (const testCase of testCasesToRun) {
      const submission = {
        source_code: decodedCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
        cpu_time_limit: 5,
        memory_limit: 128000
      };

      try {
        // Submit to Judge0
        const response = await axios.post(`${JUDGE0_API_URL}/submissions`, submission, {
          headers: {
            'X-RapidAPI-Key': JUDGE0_API_KEY,
            'Content-Type': 'application/json'
          }
        });

        const token = response.data.token;

        // Poll for results with exponential backoff
        let result;
        let attempts = 0;
        const maxAttempts = 10;
        let delay = 1000;

        do {
          await new Promise(resolve => setTimeout(resolve, delay));
          const statusResponse = await axios.get(
            `${JUDGE0_API_URL}/submissions/${token}`,
            {
              headers: {
                'X-RapidAPI-Key': JUDGE0_API_KEY
              }
            }
          );
          result = statusResponse.data;
          attempts++;
          delay = Math.min(delay * 1.5, 5000);
        } while (result.status.id <= 2 && attempts < maxAttempts);

        // Process result
        result.input = testCase.input;
        result.expected_output = testCase.output;
        executionResults.push(result);

        if (result.status.id !== 3) {
          allTestsPassed = false;
          if (testCaseIndex !== undefined) break;
        }
      } catch (error) {
        console.error('Judge0 API Error:', error);
        executionResults.push({
          status: { id: 5, description: "Judge0 API Error" },
          input: testCase.input,
          expected_output: testCase.output,
          error: error.message
        });
        allTestsPassed = false;
      }
    }

    // Save submission result
    const submissionDoc = new CodeSubmission({
      userId,
      questionId,
      code: decodedCode,
      language,
      status: allTestsPassed ? 'Accepted' : 'Wrong Answer',
      executionTime: Math.max(...executionResults.map(r => r.time || 0)),
      memory: Math.max(...executionResults.map(r => r.memory || 0))
    });
    await submissionDoc.save();

    // Update submission status
    const submissionStatus = await Submission.findOneAndUpdate(
      { userId, questionId },
      { 
        $set: { 
          isCompleted: allTestsPassed,
          submissionDate: Date.now()
        }
      },
      { upsert: true, new: true }
    );

    res.json({
      success: allTestsPassed,
      results: executionResults,
      submissionStatus: submissionStatus.isCompleted ? 'completed' : 'attempting',
      message: allTestsPassed ? 'All test cases passed!' : 'Some test cases failed'
    });

  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ 
      message: 'Error executing code', 
      error: error.message
    });
  }
});

// Get submission status
router.get("/status/:userId/:questionId", async (req, res) => {
  const { userId, questionId } = req.params;

  try {
    const submission = await Submission.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      questionId: new mongoose.Types.ObjectId(questionId)
    });

    let status = "unattempted";
    if (submission) {
      status = submission.isCompleted ? "completed" : "attempting";
    }

    res.status(200).json({
      success: true,
      status
    });
  } catch (error) {
    console.error("Error fetching submission status:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching submission status",
      error: error.message
    });
  }
});




module.exports = router;








