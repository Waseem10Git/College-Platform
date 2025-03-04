const express = require('express');
const router = express.Router();
const DepartmentCourseController = require('../controllers/DepartmentCourseController');
const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../middlewares/auth');

router.get('/departments-courses', verifyToken, asyncHandler(DepartmentCourseController.getAllDepartmentsCourses));
router.post('/departments-courses', verifyToken, asyncHandler(DepartmentCourseController.addDepartmentCourse));
router.put('/departments-courses/:id', verifyToken, asyncHandler(DepartmentCourseController.updateDepartmentCourse));
router.delete('/departments-courses/:id', verifyToken, asyncHandler(DepartmentCourseController.deleteDepartmentCourse));

module.exports = router;
