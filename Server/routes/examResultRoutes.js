const express = require('express');
const router = express.Router();
const ExamResultController = require('../controllers/ExamResultController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

router.get('/exam-results/:examId', verifyToken, asyncHandler(ExamResultController.getStudentsWithExams));
router.put('/exam-results/:enrollmentId/:examId', verifyToken, asyncHandler(ExamResultController.updateExamScore));

module.exports = router;
