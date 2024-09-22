const express = require('express');
const asyncHandler = require('express-async-handler');
const QuestionController = require('../controllers/QuestionController');
const router = express.Router();

router.post('/questions', asyncHandler(QuestionController.addQuestion));

module.exports = router;
