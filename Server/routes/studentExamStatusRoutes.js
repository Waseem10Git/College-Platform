const express = require('express');
const asyncHandler = require('express-async-handler');
const StudentExamStatusController = require('../controllers/studentExamStatusController');
const router = express.Router();

router.get('/student-exam-status/:userId/:examId', asyncHandler(StudentExamStatusController.getExamStatus));

module.exports = router;
