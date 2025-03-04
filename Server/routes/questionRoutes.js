const express = require('express');
const asyncHandler = require('express-async-handler');
const QuestionController = require('../controllers/QuestionController');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

router.post('/questions', verifyToken, asyncHandler(QuestionController.addQuestion));

module.exports = router;
