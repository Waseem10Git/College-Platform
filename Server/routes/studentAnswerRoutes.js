const express = require('express');
const asyncHandler = require('express-async-handler');
const StudentAnswerController = require('../controllers/StudentAnswerController');
const router = express.Router();

router.post('/student-answers/:userId', asyncHandler(StudentAnswerController.submitStudentAnswers));

module.exports = router;
