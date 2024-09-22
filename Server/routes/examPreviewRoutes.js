const express = require('express');
const asyncHandler = require('express-async-handler');
const ExamPreviewController = require('../controllers/ExamPreviewController');
const router = express.Router();

router.get('/exam-preview/:examId', asyncHandler(ExamPreviewController.getExamPreview));

module.exports = router;
