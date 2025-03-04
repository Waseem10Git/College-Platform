const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/EnrollmentController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

// router.post('/enrollments', asyncHandler(EnrollmentController.addStudentToCourse));// not uses
router.get('/students-enrollments', verifyToken, asyncHandler(EnrollmentController.getStudentEnrollments));
router.post('/students-enrollments', verifyToken, asyncHandler(EnrollmentController.addStudentToInstructorCourses));
router.delete('/students-enrollments/:id', verifyToken, asyncHandler(EnrollmentController.deleteStudentEnrollment));
// router.get('/enrollments', asyncHandler(EnrollmentController.getAllEnrollments));// not uses
router.get('/enrollments/:courseId/:userId', verifyToken, asyncHandler(EnrollmentController.getStudentsForCourse));

module.exports = router;
