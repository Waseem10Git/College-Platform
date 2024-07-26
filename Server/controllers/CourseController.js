// courseController.js
const courseModel = require('../models/Course');

class CourseController {
    static async getAllCourses(req, res) {
        try {
            const courses = await courseModel.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ error: "Error fetching courses" });
        }
    }

    static async addCourse(req, res) {
        const { course_code, course_name, description } = req.body;
        try {
            await courseModel.addCourse(course_code, course_name, description);
            res.json({ success: true });
        } catch (error) {
            console.error("Error adding course:", error);
            res.status(500).json({ error: "Error adding course" });
        }
    }

    static async updateCourse(req, res) {
        const { id } = req.params;
        const { course_name, description } = req.body;
        try {
            await courseModel.updateCourse(id, course_name, description);
            res.json({ success: true });
        } catch (error) {
            console.error("Error updating course:", error);
            res.status(500).json({ error: "Error updating course" });
        }
    }

    static async deleteCourse(req, res) {
        const { id } = req.params;
        try {
            await courseModel.deleteCourse(id);
            res.json({ success: true });
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(500).json({ error: "Error deleting course" });
        }
    }

    static async getStudentCourses(req, res) {
        const userId = req.params.id;
        try {
            const courses = await courseModel.getStudentCourses(userId);
            res.json(courses);
        } catch (error) {
            console.error("Error fetching student courses:", error);
            res.status(500).json({ error: "Error fetching student courses" });
        }
    }

    static async getInstructorCourses(req, res) {
        const userId = req.params.id;
        try {
            const courses = await courseModel.getInstructorCourses(userId);
            res.json(courses);
        } catch (error) {
            console.error("Error fetching instructor courses:", error);
            res.status(500).json({ error: "Error fetching instructor courses" });
        }
    }
}

module.exports = CourseController;
