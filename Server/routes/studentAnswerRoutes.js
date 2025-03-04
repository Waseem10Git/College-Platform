const express = require('express');
const asyncHandler = require('express-async-handler');
const StudentAnswerController = require('../controllers/StudentAnswerController');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

router.post('/student-answers/:userId', verifyToken, asyncHandler(StudentAnswerController.submitStudentAnswers));

module.exports = router;
