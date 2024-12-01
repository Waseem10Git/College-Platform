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
            const results = await CourseModel.getAllCoursesForStudent(studentId);
            const courses = results.map(course => ({
                course_code: course.course_code,
                course_name: course.course_name,
            }));
            return res.json(courses);
        } catch (err) {
            return res.status(500).json({ message: "Server Error in GET data: /api/student/:id/courses" });
        }
    }

    static async getAllCoursesForInstructor(req, res) {
        try {
            const instructorId = req.params.id;
            const results = await CourseModel.getAllCoursesForInstructor(instructorId);
            const courses = results.map(course => ({
                course_code: course.course_code,
                course_name: course.course_name,
            }));
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
        const { course_code, course_name } = req.body;
        try {

            if (!course_code || !course_name)
                return res.status(400).json({ success: false, message: 'All fields are required.' });

            const existingCourse = await CourseModel.getCourseById(course_code);
            if (existingCourse)
                return res.status(409).json({ success: false, message: 'Course already exists.' });

            await CourseModel.addCourse({ course_code, course_name });
            return res.send({ success: true });
        } catch (err) {
            console.error('Error inserting into courses:', err);
            return res.status(500).json({ message: 'Server Error in POST Course with endpoint: /api/courses' });
        }
    }

    static async updateCourse(req, res) {
        const { id } = req.params;
        const { course_code, course_name } = req.body;

        try {
            if (!id || !course_code || !course_name)
                return res.status(400).json({ success: false, message: 'All fields are required.' });

            const existingCourse = await CourseModel.getCourseById(course_code);
            if (id !== course_code && existingCourse)
                return res.status(409).json({ success: false, message: 'Course ID already exists.' });

            const isExist = await CourseModel.getCourseByName(course_name);
            const courseNameExist = isExist ? isExist.course_name : null;
            if (!(existingCourse.course_name === courseNameExist) && isExist)
                return res.status(409).json({ success: false, message: 'Course Name already exists.' });

            await CourseModel.updateCourse({ id, course_code, course_name });
            return res.send({ success: true });
        } catch (err) {
            console.error('Error updating course:', err);
            return res.status(500).json({ message: 'Server Error in PUT Course with endpoint: /api/courses/:id' });
        }
    }

    static async deleteCourse(req, res) {
        const { id } = req.params;

        try {
            if (!id)
                return res.status(400).json({ success: false, message: 'ID field is required.' });

            const existingCourse = await CourseModel.getCourseById(id);
            if (!existingCourse)
                return res.status(409).json({ success: false, message: 'Course is not exists.' });

            await CourseModel.deleteCourse(id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error deleting course:', err);
            return res.status(500).json({ message: 'Server Error in DELETE Course with endpoint: /api/courses/:id' });
        }
    }

    static async getAllCourses(req, res) {
        try {
            const results = await CourseModel.getAllCourses();
            const courses = results.map(course => ({
                course_code: course.course_code,
                course_name: course.course_name,
                description: course.description,
                image: course.image ? course.image.toString('base64') : null
            }));
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
