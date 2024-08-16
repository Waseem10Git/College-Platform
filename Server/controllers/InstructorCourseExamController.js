const InstructorCourseExamModel = require('../models/InstructorCourseExam');

class InstructorCourseExamController {
    static async associateExamWithCourse(req, res) {
        const { course_code, instructor_id, exam_id } = req.body;

        try {
            // Associate the exam with the instructor's course
            await InstructorCourseExamModel.associateExamWithCourse(course_code, instructor_id, exam_id);

            res.json({ Status: "Success" });
        } catch (error) {
            console.error('Database error:', error);
            res.json({ Error: "Error associating exam with instructor's course" });
        }
    }
}

module.exports = InstructorCourseExamController;
