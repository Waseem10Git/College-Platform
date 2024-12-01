const express = require('express');
const router = express.Router();
const EnrollmentExamController = require('../controllers/EnrollmentExamController');
const asyncHandler = require('express-async-handler');

router.post('/enrollmentsExams', asyncHandler(EnrollmentExamController.associateExamWithEnrollment));
router.put('/studentExamScore/:studentExamId', asyncHandler(EnrollmentExamController.editStudentExamScore));
router.get('/studentExamDetails/:studentId/:examId', asyncHandler(EnrollmentExamController.getStudentExamDetails));
router.put('/studentExam/essayQuestion/:questionId', asyncHandler(EnrollmentExamController.editEssayQuestionPoints));

module.exports = router;
