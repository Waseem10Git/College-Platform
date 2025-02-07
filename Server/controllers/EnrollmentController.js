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
            return res.status(500).json({ success: false, EnMessage: 'Sever Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async addStudentToInstructorCourses(req, res) {
        try {
            const { student_id, instructor_course_ids } = req.body;

            if (!student_id || instructor_course_ids.length <= 0)
                return res.status(400).json({ success: false, EnMessage: 'All fields are required', ArMessage: 'كل الحقول مطلوبة' });

            const isExist = await EnrollmentModel.checkStudentCourseExistence(student_id, instructor_course_ids);
            if (isExist)
                return res.status(409).json({ success: false, EnMessage: 'This instructor assigned to this course(s) already exists', ArMessage: 'هذا المدرس المخصص لهذه المادة موجود بالفعل' });

            const result = await EnrollmentModel.addStudentToInstructorCourses(student_id, instructor_course_ids);
            return res.json(result);
        } catch (err) {
            console.error('Error in assign the student to instructor course', err);
            return res.status(500).json({ success: false, EnMessage: 'Sever Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async deleteStudentEnrollment(req, res) {
        try {
            const { id } = req.params;

            if (!id)
                return res.status(400).json({ success: false, EnMessage: 'ID is not define', ArMessage: 'الرقم التعريفي غير موجود' });

            const isExist = await EnrollmentModel.checkSingleStudentCourseExistence(id);
            if (!isExist)
                return res.status(409).json({ success: false, EnMessage: 'Student-Course relation is not exists', ArMessage: 'العلاقة بين الطالب والمادة غير موجودة' });

            await EnrollmentModel.deleteStudentEnrollment(id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error deleting student enrollment:', err);
            return res.status(500).json({ success: false, EnMessage: 'Sever Error', ArMessage: 'خطأ في الخادم' });
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
            console.error('Error fetching enrollments students:', err);
            return res.status(500).json({ success: false, EnMessage: 'Sever Error', ArMessage: 'خطأ في الخادم' });
        }
    }
}

module.exports = EnrollmentController;
