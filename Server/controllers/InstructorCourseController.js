const InstructorCourseModel = require('../models/InstructorCourse');

class InstructorCourseController {
    static async addInstructorToCourses(req, res) {
        const { instructor_id, department_course_ids } = req.body;

        try {
            const result = await InstructorCourseModel.addInstructorToCourses(instructor_id, department_course_ids);
            return res.json(result);
        } catch (err) {
            console.error(err.message, err.error);
            return res.status(err.status).json({ message: err.message });
        }
    }

    static async deleteInstructorCourse(req, res) {
        const { id } = req.params;

        try {
            await InstructorCourseModel.deleteInstructorCourse(id);
            return res.json({ success: true });
        } catch (err) {
            console.error('Error deleting instructor-course relation:', err);
            return res.status(500).json({ message: 'Server Error in DELETE Instructor-Course with endpoint: /api/instructors-enrollments/:id' });
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
            return res.status(500).json({ message: 'Server Error: get instructors-departments-courses data' });
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

    static async getMeetingId(req, res) {
        try {
            const { instructorId, courseId } = req.params;
            const result = await InstructorCourseModel.getMeetingId(instructorId, courseId);

            if (result) {
                return res.json(result);
            } else {
                return res.status(404).send('Meeting ID not found');
            }
        } catch (err) {
            console.error('Error getting meeting ID:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = InstructorCourseController;
