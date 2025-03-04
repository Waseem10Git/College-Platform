const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const UserController = require('../controllers/UserController');
const upload = require('../middlewares/upload');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/user/:id', verifyToken, asyncHandler(UserController.getUser));
router.put('/user/editPassword', verifyToken, asyncHandler(UserController.editPassword));
router.get('/users/lastUserId', verifyToken, isAdmin, asyncHandler(UserController.getLastUserId));
router.get('/users', verifyToken, isAdmin, asyncHandler(UserController.getAllUsers));
router.get('/instructors', verifyToken, isAdmin, asyncHandler(UserController.getAllInstructors));
router.get('/students', verifyToken, isAdmin, asyncHandler(UserController.getAllStudents));
router.post('/add-account', verifyToken, asyncHandler(UserController.addAccount));
router.post('/update-account', verifyToken, asyncHandler(UserController.updateAccount));
router.post('/delete-account/:id', verifyToken, asyncHandler(UserController.deleteAccount));
router.post('/upload-accounts', verifyToken, upload.single('file'), asyncHandler(UserController.uploadAccounts));

module.exports = router;
