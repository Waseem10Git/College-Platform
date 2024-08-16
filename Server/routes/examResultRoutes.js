const express = require('express');
const router = express.Router();
const ExamResultController = require('../controllers/ExamResultController');
const asyncHandler = require('express-async-handler');

router.get('/exam-results/:examId', asyncHandler(ExamResultController.getExamResultsByExamId));
router.put('/exam-results/:enrollmentId/:examId', asyncHandler(ExamResultController.updateExamScore));

module.exports = router;
