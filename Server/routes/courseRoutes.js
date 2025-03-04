const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const CourseController = require('../controllers/CourseController');
const { verifyToken, isAdmin } = require('../middlewares/auth'); // Assuming you have an auth middleware

// router.get('/instructors-courses', verifyUser, isAdmin, asyncHandler(CourseController.getAllCoursesAndInstructors));// not uses
// router.get('/instructor-courses-departments', verifyUser, isAdmin, asyncHandler(CourseController.getAllInstructorCoursesDepartments));// not uses
router.get('/student/:id/courses', verifyToken, asyncHandler(CourseController.getAllCoursesForStudent));
router.get('/instructor/:id/courses', verifyToken, asyncHandler(CourseController.getAllCoursesForInstructor));
// router.get('/courses/:id', verifyUser, asyncHandler(CourseController.getCoursesByInstructorId));// not uses
router.post('/courses', verifyToken, asyncHandler(CourseController.addCourse));
router.put('/courses/:id', verifyToken, asyncHandler(CourseController.updateCourse));
router.delete('/courses/:id', verifyToken, asyncHandler(CourseController.deleteCourse));
router.get('/courses', verifyToken, asyncHandler(CourseController.getAllCourses));
// router.post('/courses', asyncHandler(CourseController.createCourse)); //not uses

module.exports = router;
