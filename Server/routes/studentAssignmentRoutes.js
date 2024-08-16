const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const StudentAssignmentController = require('../controllers/StudentAssignmentController');
const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

const storage = multer.memoryStorage(); // Use memory storage for multer
const upload = multer({ storage: storage });

router.post('/upload-student-assignment', verifyUser, upload.single('file'), asyncHandler(StudentAssignmentController.uploadStudentAssignment));

module.exports = router;
