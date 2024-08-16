// courseController.js
const CourseModel = require('../models/Course');

class CourseController {
    static async getAllCoursesAndInstructors(req, res) {
        try {
            const coursesAndInstructors = await CourseModel.getAllCoursesAndInstructors();
            return res.json(coursesAndInstructors);
        } catch (err) {
            return res.status(500).json({ message: "Server Error in GET data: /instructors-courses" });
        }
    }

    static async getAllInstructorCoursesDepartments(req, res) {
        try {
            const coursesInstructorsDepartments = await CourseModel.getAllInstructorCoursesDepartments();
            return res.json(coursesInstructorsDepartments);
        } catch (err) {
            return res.status(500).json({ message: "Server Error in GET data: /api/instructor-courses-departments" });
        }
    }

    static async getAllCoursesForStudent(req, res) {
        try {
            const studentId = req.params.id;
            const courses = await CourseModel.getAllCoursesForStudent(studentId);
            return res.json(courses);
        } catch (err) {
            return res.status(500).json({ message: "Server Error in GET data: /api/student/:id/courses" });
        }
    }

    static async getAllCoursesForInstructor(req, res) {
        try {
            const instructorId = req.params.id;
            const courses = await CourseModel.getAllCoursesForInstructor(instructorId);
            return res.json(courses);
        } catch (err) {
            return res.status(500).json({ message: "Server Error in GET data: /api/instructor/:id/courses" });
        }
    }

    static async getCoursesByInstructorId(req, res) {
        const { id } = req.params;
        try {
            const courses = await CourseModel.getCoursesByInstructorId(id);
            res.json(courses);
        } catch (error) {
            console.error('Error getting courses by instructor ID:', error);
            res.status(500).json({ message: 'Server Error', error });
        }
    }

    static async addCourse(req, res) {
        try {
            const { id, name, description } = req.body;
            const image = req.file ? req.file.buffer : null;

            await CourseModel.addCourse({ id, name, description, image });
            return res.send({ success: true });
        } catch (err) {
            console.error('Error inserting into courses:', err);
            return res.status(500).json({ message: 'Server Error in POST Course with endpoint: /api/courses' });
        }
    }

    static async updateCourse(req, res) {
        const { id } = req.params;
        const { name, description } = req.body;
        const image = req.file ? req.file.buffer : null;

        try {
            await CourseModel.updateCourse({ id, name, description, image });
            return res.send({ success: true });
        } catch (err) {
            console.error('Error updating course:', err);
            return res.status(500).json({ message: 'Server Error in PUT Course with endpoint: /api/courses/:id' });
        }
    }

    static async deleteCourse(req, res) {
        const { id } = req.params;

        try {
            await CourseModel.deleteCourse(id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error deleting course:', err);
            return res.status(500).json({ message: 'Server Error in DELETE Course with endpoint: /api/courses/:id' });
        }
    }

    static async getAllCourses(req, res) {
        try {
            const courses = await CourseModel.getAllCourses();
            return res.status(200).json(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            return res.status(500).json({ Status: "Error", Error: error });
        }
    }

    static async createCourse(req, res) {
        const { departmentId, courseCode, courseName, description } = req.body;
        console.log('Received course data:', { departmentId, courseCode, courseName, description });

        if (!departmentId || !courseCode || !courseName || !description) {
            console.error('Missing required fields:', { departmentId, courseCode, courseName, description });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            await CourseModel.createCourse(courseCode, courseName, description);
            await CourseModel.linkCourseToDepartment(departmentId, courseCode);
            res.status(201).json({ message: 'Course added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    }

    // static async deleteCourse(req, res) {
    //     const { course_code } = req.params;
    //
    //     try {
    //         await CourseModel.deleteCourse(course_code);
    //         res.sendStatus(204); // No Content, successfully deleted
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error });
    //     }
    // }
}

module.exports = CourseController;
