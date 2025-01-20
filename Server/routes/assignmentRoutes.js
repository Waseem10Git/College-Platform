const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const path = require('path');
const AssignmentController = require('../controllers/AssignmentController');
const { verifyUser, isAdmin } = require('../middlewares/auth'); // Assuming you have an auth middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload-assignment', verifyUser, upload.single('assignmentFile'), asyncHandler(AssignmentController.uploadAssignment));
router.get('/assignments/:courseId', verifyUser, asyncHandler(AssignmentController.getAssignmentsByCourseId));
router.get('/assignments/:assignmentId/students', asyncHandler(AssignmentController.getStudentsWithAssignments));
router.get('/assignments/:assignmentId/download', asyncHandler(AssignmentController.downloadAssignment));
router.get('/assignments/:assignmentId/view', asyncHandler(AssignmentController.viewInstructorAssignment));
router.delete('/assignments/:assignmentId', asyncHandler(AssignmentController.deleteAssignment));

module.exports = router;
