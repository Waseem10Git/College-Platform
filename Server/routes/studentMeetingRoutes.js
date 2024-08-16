const express = require('express');
const asyncHandler = require('express-async-handler');
const StudentMeetingController = require('../controllers/studentMeetingController');
const router = express.Router();

router.get('/student-meeting/:studentId/:courseId', asyncHandler(StudentMeetingController.getMeetingId));

module.exports = router;
