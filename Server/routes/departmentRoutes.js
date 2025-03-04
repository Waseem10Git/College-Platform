// routes/departmentRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const DepartmentController = require('../controllers/DepartmentController');
const { verifyToken } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.get('/departments', verifyToken, asyncHandler(DepartmentController.getAllDepartments));
router.post('/departments', verifyToken, asyncHandler(DepartmentController.addDepartment));
router.put('/departments/:id', verifyToken, asyncHandler(DepartmentController.updateDepartment));
router.delete('/departments/:id', verifyToken, asyncHandler(DepartmentController.deleteDepartment));
router.post('/departments/:id/levels', verifyToken, asyncHandler(DepartmentController.addLevelToDepartment));
router.delete('/departments/:id/levels', verifyToken, asyncHandler(DepartmentController.deleteLevelFromDepartment));

module.exports = router;
