const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/ExamController');
const asyncHandler = require('express-async-handler');

router.post('/exams', asyncHandler(ExamController.createExam));
router.get('/exams/:courseId', asyncHandler(ExamController.getExamsByCourse));
router.get('/exams-details/:courseId', asyncHandler(ExamController.getExamDetails));
router.get('/exams-questions/:examId', asyncHandler(ExamController.getExamQuestions));
router.get('/exams-answers/:examId', asyncHandler(ExamController.getExamAnswers));
router.put('/exams/:examId', asyncHandler(ExamController.editExam));
router.delete('/exams/:examId', asyncHandler(ExamController.deleteExam));

module.exports = router;
