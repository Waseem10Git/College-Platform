const express = require('express');
const router = express.Router();
const EnrollmentExamController = require('../controllers/EnrollmentExamController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

router.post('/enrollmentsExams', verifyToken, asyncHandler(EnrollmentExamController.associateExamWithEnrollment));
router.put('/studentExamScore/:studentExamId', verifyToken, asyncHandler(EnrollmentExamController.editStudentExamScore));
router.get('/studentExamDetails/:studentId/:examId', verifyToken, asyncHandler(EnrollmentExamController.getStudentExamDetails));
router.put('/studentExam/essayQuestion/:questionId', verifyToken, asyncHandler(EnrollmentExamController.editEssayQuestionPoints));

module.exports = router;
