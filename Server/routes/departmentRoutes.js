// routes/departmentRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const DepartmentController = require('../controllers/DepartmentController');
const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware

router.get('/departments', verifyUser, asyncHandler(DepartmentController.getAllDepartments));
router.post('/departments', verifyUser, asyncHandler(DepartmentController.addDepartment));
router.put('/departments/:id', verifyUser, asyncHandler(DepartmentController.updateDepartment));
router.delete('/departments/:id', verifyUser, asyncHandler(DepartmentController.deleteDepartment));
router.post('/departments/:id/levels', verifyUser, asyncHandler(DepartmentController.addLevelToDepartment));
router.delete('/departments/:id/levels', verifyUser, asyncHandler(DepartmentController.deleteLevelFromDepartment));

module.exports = router;
