const express = require('express');
const asyncHandler = require('express-async-handler');
const ExamPreviewController = require('../controllers/ExamPreviewController');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

router.get('/exam-preview/:examId', verifyToken, asyncHandler(ExamPreviewController.getExamPreview));

module.exports = router;
