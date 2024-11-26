const express = require("express");
const router = express.Router();
const Code = require('../models/Code');

router.post('/create/description', async (req, res) => {
    try {
      // Check if a document with this questionId already exists
      const existingCode = await Code.findOne({ questionId: req.body.questionId });
      
      if (existingCode) {
        return res.status(400).json({ error: 'Code for this question already exists' });
      }
 
      const newCode = new Code({
        problemDesc: req.body.problemDesc,
        constraints: req.body.constraints,
        input: req.body.input,
        output: req.body.output,
        explanation: req.body.explanation,
        questionId: req.body.questionId,
      });
      
      const savedCode = await newCode.save();
      res.status(200).json(savedCode);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
 });


// GET API to retrieve code details by questionId
router.get('/get-description/:questionId', async (req, res) => {
    try {
      // Find the code document matching the questionId
      const codeDetails = await Code.findOne({ 
        questionId: req.params.questionId 
      }).select('problemDesc input output explanation constraints');
 
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

 
module.exports = router;

