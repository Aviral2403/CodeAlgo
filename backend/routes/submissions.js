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


// router.post('/submit-code', async (req, res) => {
//   const { userId, questionId, code, language } = req.body;

//   try {
//     // Validate questionId is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(questionId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid question ID"
//       });
//     }

//     // Fetch the associated code details for the question
//     const codeDetails = await Code.findOne({ questionId });
//     if (!codeDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "No code details found for this question"
//       });
//     }

//     // Validate inputs and outputs
//     if (!codeDetails.input || codeDetails.input.length === 0 ||
//         !codeDetails.output || codeDetails.output.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No test cases available for this question"
//       });
//     }

//     // Array to store test case results
//     const testCaseResults = [];
//     let allTestCasesPassed = true;

//     // Run code for each test case
//     for (let i = 0; i < codeDetails.input.length; i++) {
//       try {
//         const judge0Response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
//           source_code: code,
//           language_id: language,
//           stdin: codeDetails.input[i], // Use specific input for each test case
//           expected_output: codeDetails.output[i], // Use specific expected output
//         }, {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
//             'X-RapidAPI-Key': '7a03227291msh98ef5b89026fda4p1ed3eejsnf61cbab0b3fc', // Use environment variable for API key
//           },
//         });

//         // Get submission result
//         const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${judge0Response.data.submission_id}`, {
//           headers: {
//             'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
//             'X-RapidAPI-Key': '7a03227291msh98ef5b89026fda4p1ed3eejsnf61cbab0b3fc',
//           },
//         });

//         const testCaseResult = {
//           input: codeDetails.input[i],
//           expectedOutput: codeDetails.output[i],
//           status: resultResponse.data.status,
//           stdout: resultResponse.data.stdout?.trim() || '',
//           stderr: resultResponse.data.stderr
//         };

//         // Check if test case passed
//         const isPassed = 
//           resultResponse.data.status.id === 3 && // Accepted status
//           testCaseResult.stdout === codeDetails.output[i].trim();

//         testCaseResult.passed = isPassed;
//         testCaseResults.push(testCaseResult);

//         // If any test case fails, mark overall submission as failed
//         if (!isPassed) {
//           allTestCasesPassed = false;
//         }
//       } catch (testCaseError) {
//         console.error(`Error processing test case ${i}:`, testCaseError);
//         allTestCasesPassed = false;
//         testCaseResults.push({
//           input: codeDetails.input[i],
//           expectedOutput: codeDetails.output[i],
//           passed: false,
//           error: testCaseError.message
//         });
//       }
//     }

//     // If all test cases pass, save successful submission
//     if (allTestCasesPassed) {
//       const newSubmission = new Submission({
//         userId,
//         questionId,
//         isCompleted: true,
//         submissionDate: Date.now(),
//       });

//       await newSubmission.save();

//       return res.status(200).json({
//         success: true,
//         message: 'All test cases passed',
//         testCaseResults,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: 'Some test cases failed',
//         testCaseResults,
//       });
//     }
//   } catch (error) {
//     console.error('Error during submission:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error during submission',
//       error: error.message,
//     });
//   }
// });


// routes/submission.js - Add new route for code execution
const JUDGE0_API_KEY = '7a03227291msh98ef5b89026fda4p1ed3eejsnf61cbab0b3fc';
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

router.post("/submit-code", async (req, res) => {
  const { code, language, questionId, userId, testCaseIndex } = req.body;

  try {
    // Get question and validate it exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Get code document that contains test cases
    const codeDoc = await Code.findOne({ questionId });
    if (!codeDoc) {
      return res.status(404).json({ message: "Test cases not found for this question" });
    }

    // Validate inputs and outputs arrays
    if (!Array.isArray(codeDoc.input) || !Array.isArray(codeDoc.output) || 
        codeDoc.input.length === 0 || codeDoc.output.length === 0 || 
        codeDoc.input.length !== codeDoc.output.length) {
      return res.status(400).json({ message: "Invalid test cases format" });
    }

    // Map language to Judge0 language ID
    const languageId = getJudge0LanguageId(language);

    // Initialize execution variables
    let allTestsPassed = true;
    let executionResults = [];
    
    // Determine which test cases to run
    const testCasesToRun = testCaseIndex !== undefined 
      ? [{ input: codeDoc.input[testCaseIndex], output: codeDoc.output[testCaseIndex] }]
      : codeDoc.input.map((input, idx) => ({
          input: input,
          output: codeDoc.output[idx]
        }));

    // Run test cases
    for (const testCase of testCasesToRun) {
      if (!testCase.input || !testCase.output) {
        console.warn("Skipping invalid test case:", testCase);
        continue;
      }

      // Prepare submission for Judge0
      const submission = {
        source_code: code,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output
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

        // Poll for results
        let result;
        let attempts = 0;
        const maxAttempts = 10;

        do {
          await new Promise(resolve => setTimeout(resolve, 1000));
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
        } while (result.status.id <= 2 && attempts < maxAttempts); // Still processing

        // Enhance result with test case details
        result.input = testCase.input;
        result.expected_output = testCase.output;
        
        executionResults.push(result);
        if (result.status.id !== 3) { // 3 is "Accepted" in Judge0
          allTestsPassed = false;
          if (testCaseIndex !== undefined) break; // If running single test case, break on failure
        }
      } catch (error) {
        console.error('Error with Judge0 API:', error);
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
    const submission = new CodeSubmission({
      userId,
      questionId,
      code,
      language,
      status: allTestsPassed ? 'Accepted' : 'Wrong Answer',
      executionTime: Math.max(...executionResults.map(r => r.time || 0)),
      memory: Math.max(...executionResults.map(r => r.memory || 0))
    });
    await submission.save();

    // If all tests passed, update the user's submission status
    if (allTestsPassed) {
      await Submission.findOneAndUpdate(
        { userId, questionId },
        { 
          $set: { 
            isCompleted: true,
            submissionDate: Date.now()
          }
        },
        { upsert: true }
      );
    }

    res.json({
      success: allTestsPassed,
      results: executionResults,
      message: allTestsPassed ? 'All test cases passed!' : 'Some test cases failed'
    });

  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ 
      message: 'Error executing code', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Helper function to map programming languages to Judge0 language IDs
function getJudge0LanguageId(language) {
  const languageMap = {
    'javascript': 63,  // Node.js
    'python': 71,      // Python 3
    'java': 62,        // Java
    'cpp': 54,         // C++
    'c': 50           // C
  };
  return languageMap[language.toLowerCase()] || 63; // Default to JavaScript if language not found
}




module.exports = router;