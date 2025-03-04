const express = require('express');
const asyncHandler = require('express-async-handler');
const StudentExamStatusController = require('../controllers/StudentExamStatusController');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

router.get('/student-exam-status/:userId/:examId', verifyToken, asyncHandler(StudentExamStatusController.getExamStatus));

module.exports = router;
