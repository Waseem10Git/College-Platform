const StudentAssignmentModel = require('../models/StudentAssignment');
const fs = require("fs");

class StudentAssignmentController {
    static async uploadStudentAssignment(req, res) {
        const { assignmentId, userId, instructorCourseId } = req.body;
        const studentFile = req.file;
        const { originalname: fileName, mimetype, size, path: filePath } = studentFile;

        try {
            const enrollmentResult = await StudentAssignmentModel.getEnrollmentId(userId, instructorCourseId);

            if (enrollmentResult.length === 0) {
                return res.status(404).json({ error: 'No matching enrollment found' });
            }

            const enrollmentId = enrollmentResult[0].id;

            await StudentAssignmentModel.insertStudentFile(enrollmentId, assignmentId, fileName, mimetype, size, filePath);

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

    static async viewAssignment(req, res) {
        const {studentAssignmentId} = req.params;

        try {
            const assignment = await StudentAssignmentModel.getStudentAssignmentById(studentAssignmentId);

            if (!assignment || !assignment.student_file_path) {
                return res.status(404).send('File not found');
            }

            res.setHeader("Content-Type", assignment.student_mime_type);
            res.setHeader("Content-Disposition", "inline"); // Render in browser

            // Stream the file to the client
            const fileStream = fs.createReadStream(assignment.student_file_path);
            fileStream.pipe(res);

        } catch (err) {
            console.error('Error viewing student assignment:', err);
            res.status(500).json({ error: 'An error occurred while viewing the student assignment' });
        }
    }

    static async checkAssignmentSubmission(req, res) {
        const {assignmentId, userId, instructorCourseId} = req.query;

        try {
            const assignment = await StudentAssignmentModel.getAssignmentSubmission(assignmentId, userId, instructorCourseId);

            res.status(200).json(assignment);
        } catch (err) {
            console.error('Error viewing student assignment:', err);
            res.status(500).json({ error: 'An error occurred while viewing the student assignment' });
        }
    }

    static async editStudentAssignmentScore(req, res) {
        const {studentAssignmentId} = req.params;
        const {score} = req.body;

        try {
            if (!studentAssignmentId){
                return res.status(404).json({error: 'There is data messing'});
            }

            if (!score && score < 0){
                return res.status(404).json({error: "Score can't be empty and can't be less than 0"});
            }

            await StudentAssignmentModel.editStudentAssignmentScore(studentAssignmentId, score);

            res.status(200).json({message: 'Editing score successfully'});
        } catch (err) {
            console.log('Error editing student assignment score: ', err);
            res.status(404).json({error: "An error occurred while editing the student's assignment score"})
        }
    }

    static async getStudentAssignmentScore(req, res) {
        const {studentId, assignmentId} = req.params;

        try {
            if (!studentId && !assignmentId){
                return res.status(404).json({error: 'There is data messing'});
            }

            const score = await StudentAssignmentModel.getStudentAssignmentScore(studentId, assignmentId);

            res.status(200).json(score);
        } catch (err) {
            res.status(404).json({error: "An error occurred while editing the student's assignment score"})
        }
    }
}

module.exports = StudentAssignmentController;
