const EnrollmentExamModel = require('../models/EnrollmentExam');

class EnrollmentExamController {
    static async associateExamWithEnrollment(req, res) {
        const { course_code, instructor_id, exam_id } = req.body;

        try {
            // Associate the exam with the student's enrollment
            await EnrollmentExamModel.associateExamWithEnrollment(course_code, instructor_id, exam_id);

            res.json({ Status: "Success" });
        } catch (error) {
            console.error('Database error:', error);
            res.json({ Error: "Error associating exam with student's course" });
        }
    }
}

module.exports = EnrollmentExamController;
