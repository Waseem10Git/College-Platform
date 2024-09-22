const express = require('express');
const asyncHandler = require('express-async-handler');
const StudentMeetingController = require('../controllers/StudentMeetingController');
const router = express.Router();

router.get('/student-meeting/:studentId/:courseId', asyncHandler(StudentMeetingController.getMeetingId));

module.exports = router;
