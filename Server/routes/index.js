module.exports = app => {
    app.use('/api', require('./answerRoutes'));
    app.use('/api', require('./assignmentRoutes'));
    app.use('/api/auth', require('./authRoutes'));
    app.use('/api', require('./chapterRoutes'));
    app.use('/api', require('./courseRoutes'));
    app.use('/api', require('./departmentRoutes'));
    app.use('/api', require('./departmentCourseRoutes'));
    app.use('/api', require('./enrollmentExamRoutes'));
    app.use('/api', require('./enrollmentRoutes'));
    app.use('/api', require('./examPreviewRoutes'));
    app.use('/api', require('./examResultRoutes'));
    app.use('/api', require('./examRoutes'));
    app.use('/api', require('./instructorCourseExamRoutes'));
    app.use('/api', require('./instructorCourseRoutes'));
    app.use('/api', require('./notificationRoutes'));
    app.use('/api', require('./questionRoutes'));
    app.use('/api', require('./studentAnswerRoutes'));
    app.use('/api', require('./studentAssignmentRoutes'));
    app.use('/api', require('./studentExamStatusRoutes'));
    app.use('/api', require('./studentMeetingRoutes'));
    app.use('/api', require('./userRoutes'));
}