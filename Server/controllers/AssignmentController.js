const AssignmentModel = require('../models/Assignment');
const InstructorCourseModel = require('../models/InstructorCourse')
const conn = require('../config/db');
const util = require('util');
const ChapterModel = require("../models/Chapter");
const fs = require('fs');

const MAX_LONG_BLOB_SIZE = 4 * 1024 * 1024 * 1024; // 4GB

class AssignmentController {
    static async uploadAssignment(req, res) {
        const { selectedCourse, userId, assignmentName, assignmentDescription, dueDate } = req.body;
        const fileName = req.file ? req.file.originalname : null;
        const filePath = req.file ? req.file.path : null;
        const fileSize = req.file ? req.file.size : null;
        const fileMimeType = req.file ? req.file.mimetype: null;

        if (req.file && req.file.size > MAX_LONG_BLOB_SIZE) {
            return res.status(400).json({
                message: `File is too large. Maximum size allowed is ${MAX_LONG_BLOB_SIZE / (1024 * 1024)} MB`
            });
        }

        // Promisify transaction methods
        const beginTransaction = util.promisify(conn.beginTransaction).bind(conn);
        const commit = util.promisify(conn.commit).bind(conn);
        const rollback = util.promisify(conn.rollback).bind(conn);

        try {
            await beginTransaction();

            // Fetch instructor_course_id
            const result = await InstructorCourseModel.getInstructorCourseId(userId, selectedCourse);

            if (result.length === 0) {
                res.status(404).json({ error: 'No matching instructor_course_id found' });
            }

            const instructor_course_id = result[0].id;

            // const assignmentTitleExistence = await InstructorCourseModel.checkAssignmentTitleExistence(instructor_course_id, assignmentName.trim());
            //
            // if (assignmentTitleExistence)
            //     return res.status(409).json({ success: false, message: 'Assignment Title is exist.' });

            // Insert assignment
            const assignmentId = await AssignmentModel.insertAssignment(
                assignmentName,
                assignmentDescription || null,
                fileName,
                filePath,
                fileSize,
                fileMimeType,
                dueDate
            );

            // Associate assignment with course
            await AssignmentModel.associateAssignmentWithCourse(instructor_course_id, assignmentId);

            // Associate assignment with students
            const associationResult = await AssignmentModel.associateAssignmentWithStudents(selectedCourse, userId, assignmentId);
            console.log(`Associations made: ${associationResult.affectedRows}`);

            await commit();
            res.json({ message: 'Assignment uploaded successfully' });
        } catch (error) {
            await rollback();
            console.error('Error uploading assignment:', error);
            res.status(500).json({ error: error.message });
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

    static async downloadAssignment(req, res) {
        const { assignmentId } = req.params;
        try {
            const assignment = await AssignmentModel.getAssignmentById(assignmentId);

            if (!assignment) {
                return res.status(404).send('File not found');
            }

            res.download(assignment.assignment_file_path, assignment.assignment_file_name);
        } catch (error) {
            console.error('Error downloading chapter:', error);
            res.status(500).json({ error: 'An error occurred while downloading the assignment' });
        }
    }

    static async viewInstructorAssignment(req, res) {
        const { assignmentId } = req.params;
        try {
            const assignment = await AssignmentModel.getAssignmentById(assignmentId);

            if (!assignment) {
                return res.status(404).send('File not found');
            }

            res.setHeader("Content-Type", assignment.assignment_mime_type);
            res.setHeader("Content-Disposition", "inline"); // Render in browser

            // Stream the file to the client
            const fileStream = fs.createReadStream(assignment.assignment_file_path);
            fileStream.pipe(res);

        } catch (error) {
            console.error('Error viewing chapter:', error);
            res.status(500).json({ error: 'An error occurred while viewing the assignment' });
        }
    }

    static async deleteAssignment(req, res) {
        const { assignmentId } = req.params;
        try {
            if (!assignmentId)
                return res.status(404).send({success: false, message: 'Assignment id is required'});

            const assignment = await AssignmentModel.getAssignmentById(assignmentId);

            if (!assignment)
                return res.status(404).send({success: false, message: 'Assignment Not Found'})

            if (!assignment.assignment_file_path) {
                await AssignmentModel.deleteAssignment(assignmentId);
                return res.status(200).send({success: true, message: 'Assignment deleted successfully'});
            } else {
                fs.unlink(assignment.assignment_file_path, async (err) => {
                    if (err) {
                        console.error("Error deleting file from filesystem:", err);
                        return res.status(500).json({ error: "Failed to delete file from filesystem" });
                    }

                    await AssignmentModel.deleteAssignment(assignmentId);
                    return res.status(200).send({success: true, message: 'Assignment deleted successfully'});
                });
            }
        } catch (err) {
            res.status(500).json({ error: 'An error occurred while deleting the assignment'});
        }
    }
}

module.exports = AssignmentController;
