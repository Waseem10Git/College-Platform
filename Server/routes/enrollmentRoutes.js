const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/EnrollmentController');
const asyncHandler = require('express-async-handler');

// router.post('/enrollments', asyncHandler(EnrollmentController.addStudentToCourse));// not uses
router.get('/students-enrollments', asyncHandler(EnrollmentController.getStudentEnrollments));
router.post('/students-enrollments', asyncHandler(EnrollmentController.addStudentToInstructorCourses));
router.delete('/students-enrollments/:id', asyncHandler(EnrollmentController.deleteStudentEnrollment));
// router.get('/enrollments', asyncHandler(EnrollmentController.getAllEnrollments));// not uses
router.get('/enrollments/:courseId/:userId', asyncHandler(EnrollmentController.getStudentsForCourse));

module.exports = router;
