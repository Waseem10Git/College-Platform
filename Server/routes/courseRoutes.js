const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CourseController = require('../controllers/CourseController');
const { verifyUser, isAdmin } = require('../middlewares/auth'); // Assuming you have an auth middleware

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/instructors-courses', verifyUser, isAdmin, asyncHandler(CourseController.getAllCoursesAndInstructors));
router.get('/instructor-courses-departments', verifyUser, isAdmin, asyncHandler(CourseController.getAllInstructorCoursesDepartments));
router.get('/student/:id/courses', verifyUser, asyncHandler(CourseController.getAllCoursesForStudent));
router.get('/instructor/:id/courses', verifyUser, asyncHandler(CourseController.getAllCoursesForInstructor));
router.get('/courses/:id', verifyUser, asyncHandler(CourseController.getCoursesByInstructorId));
router.post('/courses', asyncHandler(CourseController.addCourse));
router.put('/courses/:id', asyncHandler(CourseController.updateCourse));
router.delete('/courses/:id', asyncHandler(CourseController.deleteCourse));
router.get('/courses', asyncHandler(CourseController.getAllCourses));
router.post('/courses', asyncHandler(CourseController.createCourse));
// router.delete('/courses/:course_code', asyncHandler(CourseController.deleteCourse));

module.exports = router;
