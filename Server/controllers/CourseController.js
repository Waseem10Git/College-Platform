// courseController.js
const CourseModel = require('../models/Course');

class CourseController {
    static async getAllCoursesAndInstructors(req, res) {
        try {
            const coursesAndInstructors = await CourseModel.getAllCoursesAndInstructors();
            return res.json(coursesAndInstructors);
        } catch (err) {
            console.log('Error getting courses and instructors', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async getAllInstructorCoursesDepartments(req, res) {
        try {
            const coursesInstructorsDepartments = await CourseModel.getAllInstructorCoursesDepartments();
            return res.json(coursesInstructorsDepartments);
        } catch (err) {
            console.log('Error getting instructors courses departments')
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
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
            console.log('Error getting all courses for student', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
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
            console.log('Error getting courses for instructor', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async getCoursesByInstructorId(req, res) {
        const { id } = req.params;
        try {
            const courses = await CourseModel.getCoursesByInstructorId(id);
            res.json(courses);
        } catch (error) {
            console.error('Error getting courses by instructor ID:', error);
            res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async addCourse(req, res) {
        const { course_code, course_name } = req.body;
        try {

            if (!course_code || !course_name)
                return res.status(400).json({ success: false, EnMessage: 'All fields are required', ArMessage: 'كل الحقول مطلوبة' });

            const existingCourse = await CourseModel.getCourseById(course_code);
            if (existingCourse)
                return res.status(409).json({ success: false, EnMessage: 'Course already exists', ArMessage: 'المادة موجودة بالفعل' });

            await CourseModel.addCourse({ course_code, course_name });
            return res.send({ success: true });
        } catch (err) {
            console.error('Error inserting into courses:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async updateCourse(req, res) {
        const { id } = req.params;
        const { course_code, course_name } = req.body;

        try {
            if (!id || !course_code || !course_name)
                return res.status(400).json({ success: false, EnMessage: 'All fields are required', ArMessage: 'كل الحقول مطلوبة' });

            const existingCourse = await CourseModel.getCourseById(course_code);
            if (id !== course_code && existingCourse)
                return res.status(409).json({ success: false, EnMessage: 'Course ID already exists', ArMessage: 'الرقم التعريفي للمادة موجود بالفعل' });

            const isExist = await CourseModel.getCourseByName(course_name);
            const courseNameExist = isExist ? isExist.course_name : null;
            if (isExist && existingCourse && !(existingCourse.course_name === courseNameExist))
                return res.status(409).json({ success: false, EnMessage: 'Course Name already exists', ArMessage: 'المادة موجودة بالفعل' });

            await CourseModel.updateCourse({ id, course_code, course_name });
            return res.send({ success: true });
        } catch (err) {
            console.error('Error updating course:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async deleteCourse(req, res) {
        const { id } = req.params;

        try {
            if (!id)
                return res.status(400).json({ success: false, EnMessage: 'ID field is required', ArMessage: 'الرقم التعريفي مطلوب' });

            const existingCourse = await CourseModel.getCourseById(id);
            if (!existingCourse)
                return res.status(409).json({ success: false, EnMessage: 'Course is not exists', ArMessage: 'المادة ليست موجودة' });

            await CourseModel.deleteCourse(id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error deleting course:', err);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    static async getAllCourses(req, res) {
        try {
            const results = await CourseModel.getAllCourses();

            return res.status(200).json(results);
        } catch (error) {
            console.error("Error fetching courses:", error);
            return res.status(500).json({ success: false, EnMessage: 'Server Error', ArMessage: 'خطأ في الخادم' });
        }
    }

    // static async createCourse(req, res) {
    //     const { departmentId, courseCode, courseName, description } = req.body;
    //     console.log('Received course data:', { departmentId, courseCode, courseName, description });
    //
    //     if (!departmentId || !courseCode || !courseName || !description) {
    //         console.error('Missing required fields:', { departmentId, courseCode, courseName, description });
    //         return res.status(400).json({ error: 'Missing required fields' });
    //     }
    //
    //     try {
    //         await CourseModel.createCourse(courseCode, courseName, description);
    //         await CourseModel.linkCourseToDepartment(departmentId, courseCode);
    //         res.status(201).json({ message: 'Course added successfully' });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error });
    //     }
    // }

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
