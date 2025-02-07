const DepartmentCourseModel = require('../models/DepartmentCourse');

class DepartmentCourseController {
    static async getAllDepartmentsCourses(req, res) {
        try {
            const data = await DepartmentCourseModel.getAllDepartmentsCourses();
            return res.status(200).json(data);
        } catch (err) {
            console.error('Server Error ON GET departments-courses:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async addDepartmentCourse(req, res) {
        try {
            const { department_id, course_id, level, semester } = req.body;

            if (!department_id || !course_id || !level || !semester)
                return res.status(400).json({ success: false, EnMessage: 'All fields are required', ArMessage: 'كل الحقول مطلوبة' });

            const isExist = await DepartmentCourseModel.checkDepartmentCourseExistence(department_id + '_' + course_id)
            if (isExist)
                return res.status(409).json({ success: false, EnMessage: 'This course-department combination already exists', ArMessage: 'هذا المزيج من المقرر والقسم موجود بالفعل' });

            await DepartmentCourseModel.addDepartmentCourse(department_id, course_id, level, semester);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Error inserting into departments-courses:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async updateDepartmentCourse(req, res) {
        try {
            const { id } = req.params;
            const { department_id, course_id, level, semester } = req.body;

            const isExist = await DepartmentCourseModel.checkDepartmentCourseExistence(id)
            if (isExist && id !== department_id +'_'+ course_id)
                return res.status(409).json({ success: false, message: 'This course-department combination already exists.' });

            await DepartmentCourseModel.updateDepartmentCourse(id, department_id, course_id, level, semester);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Error updating departments-courses:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async deleteDepartmentCourse(req, res) {
        try {
            const { id } = req.params;

            if (!id)
                return res.status(400).json({ success: false, message: 'ID is not define' });

            const isExist = await DepartmentCourseModel.checkDepartmentCourseExistence(id);
            if (!isExist)
                return res.status(409).json({ success: false, message: 'Course is not exists.' });

            await DepartmentCourseModel.deleteDepartmentCourse(id);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Error deleting from departments-courses:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }
}

module.exports = DepartmentCourseController;
