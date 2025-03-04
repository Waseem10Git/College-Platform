const express = require('express');
const router = express.Router();
const ExamController = require('../controllers/ExamController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

router.post('/exams', verifyToken, asyncHandler(ExamController.createExam));
router.get('/exams/:courseId', verifyToken, asyncHandler(ExamController.getExamsByCourse));
router.get('/exams-details/:examId', verifyToken, asyncHandler(ExamController.getExamDetails));
router.get('/exams-questions/:examId', verifyToken, asyncHandler(ExamController.getExamQuestions));
router.get('/exams-answers/:examId', verifyToken, asyncHandler(ExamController.getExamAnswers));
router.put('/exams/:examId', verifyToken, asyncHandler(ExamController.editExam));
router.delete('/exams/:examId', verifyToken, asyncHandler(ExamController.deleteExam));

module.exports = router;
