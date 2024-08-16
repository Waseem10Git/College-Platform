const StudentAssignmentModel = require('../models/StudentAssignment');
const fs = require('fs');

class StudentAssignmentController {
    static async uploadStudentAssignment(req, res) {
        const { courseId, assignmentId, userId, instructorCourseId } = req.body;
        const studentFile = req.file;
        console.log("student file", studentFile);

        try {
            const enrollmentResult = await StudentAssignmentModel.getEnrollmentId(userId, instructorCourseId);

            if (enrollmentResult.length === 0) {
                return res.status(404).json({ error: 'No matching enrollment found' });
            }

            const enrollmentId = enrollmentResult[0].id;
            const fileData = studentFile.buffer;

            await StudentAssignmentModel.insertStudentFile(enrollmentId, assignmentId, fileData, studentFile.originalname);

            console.log('Student assignment uploaded successfully');
            res.json({ message: 'Assignment uploaded successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred during the upload process' });

            try {
                await StudentAssignmentModel.deleteFile(studentFile.path);
            } catch (unlinkError) {
                console.error('Error deleting temporary file:', unlinkError);
            }
        }
    }
}

module.exports = StudentAssignmentController;
