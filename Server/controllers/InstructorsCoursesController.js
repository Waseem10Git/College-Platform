const InstructorsCoursesModel = require("../models/InstructorsCourses");


class InstructorsCoursesController {
    static async getAllInstructorsCourses(req, res) {
        try {
            const result = await InstructorsCoursesModel.getInstructorsCourses();
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send({ error: 'No users found' });
            }
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }

    static async addInstructorToCourse(req, res) {
        const { instructor_id, course_id } = req.body;

        try {
            await InstructorsCoursesModel.addInstructorToCourse(instructor_id, course_id);
            res.json({ success: true });
        } catch (error) {
            console.error("Error adding instructor to course:", error);
            res.status(500).json({ message: "Server Error", error });
        }
    }

}

module.exports = InstructorsCoursesController;