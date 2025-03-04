const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const path = require('path');
const AssignmentController = require('../controllers/AssignmentController');
const { verifyToken, isAdmin } = require('../middlewares/auth'); // Assuming you have an auth middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload-assignment', verifyToken, upload.single('assignmentFile'), asyncHandler(AssignmentController.uploadAssignment));
router.get('/assignments/:courseId', verifyToken, asyncHandler(AssignmentController.getAssignmentsByCourseId));
router.get('/assignments/:assignmentId/students', verifyToken, asyncHandler(AssignmentController.getStudentsWithAssignments));
router.get('/assignments/:assignmentId/download', verifyToken, asyncHandler(AssignmentController.downloadAssignment));
router.get('/assignments/:assignmentId/view', verifyToken, asyncHandler(AssignmentController.viewInstructorAssignment));
router.delete('/assignments/:assignmentId', verifyToken, asyncHandler(AssignmentController.deleteAssignment));

module.exports = router;
