const express = require('express');
const asyncHandler = require('express-async-handler');
const AnswerController = require('../controllers/answerController');
const router = express.Router();

router.post('/answers', asyncHandler(AnswerController.addAnswer));

module.exports = router;
