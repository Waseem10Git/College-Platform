const express = require('express');
const router = express.Router();
const EnrollmentExamController = require('../controllers/EnrollmentExamController');
const asyncHandler = require('express-async-handler');

router.post('/enrollmentsExams', asyncHandler(EnrollmentExamController.associateExamWithEnrollment));

module.exports = router;
