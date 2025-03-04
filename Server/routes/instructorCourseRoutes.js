const express = require('express');
const router = express.Router();
const InstructorCourseController = require('../controllers/InstructorCourseController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

router.post('/instructors-enrollments', verifyToken, asyncHandler(InstructorCourseController.addInstructorToCourses));
router.delete('/instructors-enrollments/:id', verifyToken, asyncHandler(InstructorCourseController.deleteInstructorCourse));
// router.get('/instructors-courses', verifyToken, asyncHandler(InstructorCourseController.getAllInstructorCourses));// not uses
router.get('/instructors-departments-courses', verifyToken, asyncHandler(InstructorCourseController.getInstructorsDepartmentsCourses));
// router.post('/instructors-courses', verifyToken, asyncHandler(InstructorCourseController.addInstructorCourses)); // not uses

module.exports = router;
