const EnrollmentModel = require('../models/Enrollment');
const InstructorCourseModel = require("../models/InstructorCourse");

class EnrollmentController {
    static async addStudentToCourse(req, res) {
        const { student_id, course_id } = req.body;

        try {
            await EnrollmentModel.addStudentToCourse(student_id, course_id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error adding student to course:', err);
            return res.status(500).json({ message: 'Server Error in POST Enrollment with endpoint: /api/enrollments' });
        }
    }

    static async getStudentEnrollments(req, res) {
        try {
            const enrollments = await EnrollmentModel.getStudentEnrollments();
            return res.json(enrollments);
        } catch (err) {
            console.error('Error fetching student enrollments:', err);
            return res.status(500).json({ message: 'Server Error in GET Enrollments with endpoint: /api/students-enrollments' });
        }
    }

    static async addStudentToInstructorCourses(req, res) {
        try {
            const { student_id, instructor_course_ids } = req.body;

            if (!student_id || instructor_course_ids.length <= 0)
                return res.status(400).json({ success: false, message: 'All fields are required.' });

            const isExist = await EnrollmentModel.checkStudentCourseExistence(student_id, instructor_course_ids);
            if (isExist)
                return res.status(409).json({ success: false, message: 'This instructor assigned to this course(s) already exists.' });

            const result = await EnrollmentModel.addStudentToInstructorCourses(student_id, instructor_course_ids);
            return res.json(result);
        } catch (err) {
            console.error(err.messages || err.message);
            return res.status(err.status || 500).json({ messages: err.messages || [err.message] });
        }
    }

    static async deleteStudentEnrollment(req, res) {
        try {
            const { id } = req.params;

            if (!id)
                return res.status(400).json({ success: false, message: 'ID is not define' });

            const isExist = await EnrollmentModel.checkSingleStudentCourseExistence(id);
            if (!isExist)
                return res.status(409).json({ success: false, message: 'Student-Course relation is not exists.' });

            await EnrollmentModel.deleteStudentEnrollment(id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error deleting student enrollment:', err);
            return res.status(500).json({ message: 'Server Error in DELETE Enrollment with endpoint: /api/students-enrollments/:id' });
        }
    }

    static async getAllEnrollments(req, res) {
        try {
            const enrollments = await EnrollmentModel.getAllEnrollments();
            return res.json(enrollments);
        } catch (err) {
            console.error('Error fetching enrollments:', err);
            return res.status(500).json({ message: 'Server Error in GET All Enrollments with endpoint: /enrollments' });
        }
    }

    static async getStudentsForCourse(req, res) {
        const { courseId, userId } = req.params;

        try {
            const students = await EnrollmentModel.getStudentsForCourse(courseId, userId);
            return res.status(200).json(students);
        } catch (err) {
            console.error('Error fetching enrollments:', err);
            return res.status(500).json({ message: 'Error fetching enrollments' });
        }
    }
}

module.exports = EnrollmentController;
