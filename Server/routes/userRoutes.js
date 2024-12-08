const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const UserController = require('../controllers/UserController');
const upload = require('../middlewares/upload');
const { verifyUser, isAdmin } = require('../middlewares/auth');

router.get('/user/:id', verifyUser, asyncHandler(UserController.getUser));
router.put('/user/update', verifyUser, upload.single('image'), asyncHandler(UserController.updateUser));
router.get('/users', verifyUser, isAdmin, asyncHandler(UserController.getAllUsers));
router.get('/instructors', verifyUser, isAdmin, asyncHandler(UserController.getAllInstructors));
router.get('/students', verifyUser, isAdmin, asyncHandler(UserController.getAllStudents));
router.post('/add-account', asyncHandler(UserController.addAccount));
router.post('/update-account', asyncHandler(UserController.updateAccount));
router.post('/delete-account/:id', asyncHandler(UserController.deleteAccount));
router.post('/upload-accounts', upload.single('file'), asyncHandler(UserController.uploadAccounts));

module.exports = router;
