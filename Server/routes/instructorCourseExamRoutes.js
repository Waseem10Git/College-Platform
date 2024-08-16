const express = require('express');
const router = express.Router();
const InstructorCourseExamController = require('../controllers/InstructorCourseExamController');
const asyncHandler = require('express-async-handler');

router.post('/instructorsCoursesExams', asyncHandler(InstructorCourseExamController.associateExamWithCourse));

module.exports = router;
