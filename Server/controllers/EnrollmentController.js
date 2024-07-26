const courseEnrollmentModel = require('../models/Enrollment');

class EnrollmentController {
    static async addStudentToCourse(req, res) {
        const { student_id, course_id } = req.body;

        try {
            await courseEnrollmentModel.addStudentToCourse(student_id, course_id);
            res.json({ success: true });
        } catch (error) {
            console.error("Error adding student to course:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }
}

module.exports = EnrollmentController;