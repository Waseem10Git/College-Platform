const AssignmentModel = require('../models/Assignment');
const fs = require('fs');
const path = require('path');
const conn = require('../config/db');

class AssignmentController {
    static async uploadAssignment(req, res) {
        const { selectedCourse, userId, assignmentName, assignmentDescription, dueDate } = req.body;
        const assignmentFile = req.file;
        const filePath = path.join(__dirname, assignmentFile.path);
        const fileData = fs.readFileSync(filePath);

        try {
            conn.beginTransaction(async (err) => {
                if (err) {
                    console.error('Transaction Error:', err);
                    return res.status(500).json({ error: 'Transaction Error' });
                }

                const result = await AssignmentModel.getInstructorCourseId(userId, selectedCourse);

                if (result.length === 0) {
                    return conn.rollback(() => {
                        console.error('No matching instructor_course_id found');
                        res.status(404).json({ error: 'No matching instructor_course_id found' });
                    });
                }

                const instructor_course_id = result[0].id;
                const courseName = result[0].course_name;
                const assignmentId = await AssignmentModel.insertAssignment(
                    assignmentName,
                    assignmentDescription,
                    assignmentFile.originalname,
                    fileData,
                    dueDate
                );

                await AssignmentModel.associateAssignmentWithCourse(instructor_course_id, assignmentId);

                const notificationMessage = `New Assignment added: ${courseName}`;
                await AssignmentModel.createNotification(instructor_course_id, notificationMessage);

                conn.commit((err) => {
                    if (err) {
                        return conn.rollback(() => {
                            console.error('Transaction commit failed:', err);
                            res.status(500).json({ error: 'Transaction commit failed' });
                        });
                    }

                    // Emit notification event
                    io.emit('notification', { userId, message: notificationMessage });
                    console.log('Assignment uploaded successfully');
                    res.json({ message: 'Assignment uploaded successfully' });

                    // Cleanup: delete the temporary file after storing in database
                    AssignmentModel.cleanupTemporaryFile(filePath);
                });
            });
        } catch (error) {
            console.error('Error uploading assignment:', error);
            res.status(500).json({ error: 'Failed to upload assignment' });
        }
    }

    static async getAssignmentsByCourseId(req, res) {
        const courseId = req.params.courseId;

        try {
            const results = await AssignmentModel.getAssignmentsByCourseId(courseId);
            res.json(results);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            res.status(500).json({ error: 'An error occurred while fetching assignments' });
        }
    }

    static async getStudentsWithAssignments(req, res) {
        const { assignmentId } = req.params;

        try {
            const studentsWithAssignments = await AssignmentModel.getStudentsWithAssignments(assignmentId);
            return res.status(200).json(studentsWithAssignments);
        } catch (err) {
            console.error('Error fetching assignments:', err);
            return res.status(500).json({ message: 'Error fetching assignments' });
        }
    }
}

module.exports = AssignmentController;
