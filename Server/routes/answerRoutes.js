const express = require('express');
const asyncHandler = require('express-async-handler');
const AnswerController = require('../controllers/AnswerController');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

router.post('/answers', verifyToken, asyncHandler(AnswerController.addAnswer));

module.exports = router;