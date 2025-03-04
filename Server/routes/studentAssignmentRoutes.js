const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const multer = require('multer');
const StudentAssignmentController = require('../controllers/StudentAssignmentController');
const { verifyToken } = require('../middlewares/auth');

const storage = multer.memoryStorage(); // Use memory storage for multer
const upload = multer({ dest: 'uploads/' });

router.post('/upload-student-assignment', verifyToken, upload.single('file'), asyncHandler(StudentAssignmentController.uploadStudentAssignment));
router.get('/studentAssignment/:studentAssignmentId/view', verifyToken, asyncHandler(StudentAssignmentController.viewAssignment));
router.get('/studentAssignment/checkAssignmentSubmission', verifyToken, asyncHandler(StudentAssignmentController.checkAssignmentSubmission));
router.put('/studentAssignmentScore/:studentAssignmentId', verifyToken, asyncHandler(StudentAssignmentController.editStudentAssignmentScore));
router.get('/studentAssignment/:studentId/:assignmentId', verifyToken, asyncHandler(StudentAssignmentController.getStudentAssignmentScore));

module.exports = router;
