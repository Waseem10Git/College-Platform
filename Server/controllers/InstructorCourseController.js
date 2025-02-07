const InstructorCourseModel = require('../models/InstructorCourse');
const DepartmentCourseModel = require("../models/DepartmentCourse");

class InstructorCourseController {
    static async addInstructorToCourses(req, res) {
        try {
            const { instructor_id, department_course_ids } = req.body;
            if (!instructor_id || department_course_ids.length <= 0)
                return res.status(400).json({ success: false, EnMessage: 'All fields are required', ArMessage: 'كل الحقول مطلوبة' });

            const isExist = await InstructorCourseModel.checkInstructorCourseExistence(instructor_id, department_course_ids);
            if (isExist)
                return res.status(409).json({ success: false, EnMessage: 'This instructor assigned to this course(s) already exists', ArMessage: 'هذا المدرس المخصص لهذه المادة موجود بالفعل' });

            await InstructorCourseModel.addInstructorToCourses(instructor_id, department_course_ids);
            return res.send({ success: true });
        } catch (err) {
            console.error(err.message, err.error);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async deleteInstructorCourse(req, res) {
        try {
            const { id } = req.params;

            if (!id)
                return res.status(400).json({ success: false, EnMessage: 'ID is not define', ArMessage: 'الرقم التعريفي غير موجود' });

            const isExist = await InstructorCourseModel.checkSingleInstructorCourseExistence(id);
            if (!isExist)
                return res.status(409).json({ success: false, EnMessage: 'Instructor-Course relation is not exists', ArMessage: 'العلاقة بين المدرس والمادة غير موجود' });

            await InstructorCourseModel.deleteInstructorCourse(id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error deleting instructor-course relation:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async getAllInstructorCourses(req, res) {
        try {
            const instructorCourses = await InstructorCourseModel.getAllInstructorCourses();
            return res.json(instructorCourses);
        } catch (err) {
            console.error('Error fetching instructor-courses:', err);
            return res.status(500).json({ message: 'Server Error in GET All Instructor-Courses with endpoint: /api/instructors-courses' });
        }
    }

    static async getInstructorsDepartmentsCourses(req, res) {
        try {
            const data = await InstructorCourseModel.getInstructorsDepartmentsCourses();
            return res.status(200).json(data);
        } catch (err) {
            console.error('Error fetching instructors-departments-courses data:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async addInstructorCourses(req, res) {
        const { instructorEmail, courseCodes } = req.body;

        try {
            // Get instructor ID
            const instructorId = await InstructorCourseModel.getInstructorIdByEmail(instructorEmail);

            // Prepare the values for bulk insertion
            const values = courseCodes.map(courseCode => [instructorId, courseCode]);

            // Insert the instructor-course pairs into the database
            await InstructorCourseModel.addInstructorCourses(values);

            res.sendStatus(200); // OK
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error adding instructor-courses." });
        }
    }

}

module.exports = InstructorCourseController;
