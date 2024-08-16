const express = require('express');
const router = express.Router();
const DepartmentCourseController = require('../controllers/DepartmentCourseController');
const asyncHandler = require('express-async-handler');

router.get('/departments-courses', asyncHandler(DepartmentCourseController.getAllDepartmentsCourses));
router.post('/departments-courses', asyncHandler(DepartmentCourseController.addDepartmentCourse));
router.put('/departments-courses/:id', asyncHandler(DepartmentCourseController.updateDepartmentCourse));
router.delete('/departments-courses/:id', asyncHandler(DepartmentCourseController.deleteDepartmentCourse));

module.exports = router;
