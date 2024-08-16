const DepartmentCourseModel = require('../models/DepartmentCourse');

class DepartmentCourseController {
    static async getAllDepartmentsCourses(req, res) {
        try {
            const data = await DepartmentCourseModel.getAllDepartmentsCourses();
            return res.status(200).json(data);
        } catch (err) {
            console.error('Server Error ON GET departments-courses:', err);
            return res.status(500).json({ message: 'Server Error ON GET departments-courses' });
        }
    }

    static async addDepartmentCourse(req, res) {
        try {
            const { department_id, course_id, level, semester } = req.body;
            await DepartmentCourseModel.addDepartmentCourse(department_id, course_id, level, semester);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Error inserting into departments-courses:', err);
            return res.status(500).json({ message: 'Error inserting into departments-courses' });
        }
    }

    static async updateDepartmentCourse(req, res) {
        try {
            const { id } = req.params;
            const { department_id, course_id, level, semester } = req.body;
            await DepartmentCourseModel.updateDepartmentCourse(id, department_id, course_id, level, semester);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Error updating departments-courses:', err);
            return res.status(500).json({ message: 'Error updating departments-courses' });
        }
    }

    static async deleteDepartmentCourse(req, res) {
        try {
            const { id } = req.params;
            await DepartmentCourseModel.deleteDepartmentCourse(id);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error('Error deleting from departments-courses:', err);
            return res.status(500).json({ message: 'Error deleting from departments-courses' });
        }
    }
}

module.exports = DepartmentCourseController;
