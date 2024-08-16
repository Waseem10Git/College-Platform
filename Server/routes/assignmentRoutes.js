const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AssignmentController = require('../controllers/AssignmentController');
const { verifyUser, isAdmin } = require('../middlewares/auth'); // Assuming you have an auth middleware

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be uploaded
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});
const upload = multer({ storage: storage });

router.post('/upload-assignment', verifyUser, upload.single('assignmentFile'), asyncHandler(AssignmentController.uploadAssignment));
router.get('/assignments/:courseId', verifyUser, asyncHandler(AssignmentController.getAssignmentsByCourseId));
router.get('/assignments/:assignmentId/students', asyncHandler(AssignmentController.getStudentsWithAssignments));

module.exports = router;
