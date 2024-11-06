const express = require('express');
const router = express.Router();
const InstructorCourseController = require('../controllers/InstructorCourseController');
const asyncHandler = require('express-async-handler');

router.post('/instructors-enrollments', asyncHandler(InstructorCourseController.addInstructorToCourses));
router.delete('/instructors-enrollments/:id', asyncHandler(InstructorCourseController.deleteInstructorCourse));
router.get('/instructors-courses', asyncHandler(InstructorCourseController.getAllInstructorCourses));
router.get('/instructors-departments-courses', asyncHandler(InstructorCourseController.getInstructorsDepartmentsCourses));
router.post('/instructors-courses', asyncHandler(InstructorCourseController.addInstructorCourses));

module.exports = router;
