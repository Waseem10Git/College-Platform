// routes/authRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const AuthController = require('../controllers/AuthContoller');
const { verifyUser } = require('../middlewares/auth');

router.get('/', verifyUser, asyncHandler(AuthController.getUserInfo));
router.post('/signIn', asyncHandler(AuthController.signIn));
router.get('/signOut', asyncHandler(AuthController.signOut));

module.exports = router;
