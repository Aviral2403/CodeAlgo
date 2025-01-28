const express = require("express");
const router = express.Router();
const Code = require('../models/Code');

// Create code description with optional starter templates
router.post('/create/description', async (req, res) => {
  try {
    // Check if a document with this questionId already exists
    const existingCode = await Code.findOne({ questionId: req.body.questionId });

    if (existingCode) {
      return res.status(400).json({ error: 'Code for this question already exists' });
    }

    // Prepare the new code document
    const newCode = new Code({
      problemDesc: req.body.problemDesc,
      constraints: req.body.constraints,
      input: req.body.input,
      output: req.body.output,
      explanation: req.body.explanation,
      questionId: req.body.questionId,
      
      // Add starter templates if provided
      starterTemplates: req.body.starterTemplates || {}
    });

    const savedCode = await newCode.save();
    res.status(200).json(savedCode);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// Endpoint to update code details for a specific question
router.put('/update-description/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    
    // Extract updatable fields from request body
    const updateFields = {
      problemDesc: req.body.problemDesc,
      constraints: req.body.constraints,
      input: req.body.input,
      output: req.body.output,
      explanation: req.body.explanation
    };

    // Remove undefined fields to prevent overwriting with undefined
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    // Find and update the code document
    const updatedCode = await Code.findOneAndUpdate(
      { questionId: questionId },
      { $set: updateFields },
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run model validation on update
      }
    );

    // Check if document was found and updated
    if (!updatedCode) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Respond with updated document
    res.status(200).json(updatedCode);

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      error: 'Server error', 
      details: err.message 
    });
  }
});

// GET API to retrieve code details by questionId
router.get('/get-description/:questionId', async (req, res) => {
  try {
    // Find the code document matching the questionId
    const codeDetails = await Code.findOne({
      questionId: req.params.questionId
    }).select('problemDesc input output explanation constraints starterTemplates');

    // If no code details found for this questionId
    if (!codeDetails) {
      return res.status(404).json({
        error: 'No code details found for the given question'
      });
    }

    // Return the code details
    res.status(200).json(codeDetails);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
});

// New endpoint to update starter templates for a specific question
router.post('/update-starter-templates/:questionId', async (req, res) => {
  try {
    const { starterTemplates } = req.body;
    
    // Validate input
    if (!starterTemplates || typeof starterTemplates !== 'object') {
      return res.status(400).json({ error: 'Invalid starter templates' });
    }

    // Find and update the code document
    const updatedCode = await Code.findOneAndUpdate(
      { questionId: req.params.questionId },
      { $set: { starterTemplates } },
      { new: true, runValidators: true }
    );

    if (!updatedCode) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(updatedCode);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// Example endpoint to get starter template for a specific question
router.get('/get-starter-template/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;

    const codeDetails = await Code.findOne({ questionId });

    if (!codeDetails) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const starterTemplate = codeDetails.starterTemplates;

    if (!starterTemplate) {
      return res.status(404).json({ error: `No starter template` });
    }

    res.status(200).json({ starterTemplate });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;

