// routes/authRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const AuthController = require('../controllers/AuthContoller');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, asyncHandler(AuthController.getUserInfo));
router.post('/signIn', asyncHandler(AuthController.signIn));
router.post('/signOut', asyncHandler(AuthController.signOut));

module.exports = router;
