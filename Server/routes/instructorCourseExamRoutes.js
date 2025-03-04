const express = require('express');
const router = express.Router();
const InstructorCourseExamController = require('../controllers/InstructorCourseExamController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

router.post('/instructorsCoursesExams', verifyToken, asyncHandler(InstructorCourseExamController.associateExamWithCourse));

module.exports = router;
