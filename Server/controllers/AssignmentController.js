const AssignmentModel = require('../models/Assignment');
const InstructorCourseModel = require('../models/InstructorCourse')
const conn = require('../config/db');
const util = require('util');
const ChapterModel = require("../models/Chapter");

const MAX_LONG_BLOB_SIZE = 4 * 1024 * 1024 * 1024; // 4GB

class AssignmentController {
    static async uploadAssignment(req, res) {
        const { selectedCourse, userId, assignmentName, assignmentDescription, dueDate } = req.body;
        const fileData = req.file ? req.file.buffer : null;
        const fileName = req.file ? req.file.originalname : null;

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

            // Insert assignment
            const assignmentId = await AssignmentModel.insertAssignment(
                assignmentName,
                assignmentDescription || null,
                fileName,
                fileData,
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

            res.setHeader('Content-Disposition', 'attachment; filename=' + assignment.assignment_file_name);
            res.send(assignment.assignment_file);

        } catch (error) {
            console.error('Error downloading chapter:', error);
            res.status(500).json({ error: 'An error occurred while downloading the chapter' });
        }
    }

    static async viewInstructorAssignment(req, res) {
        const { assignmentId } = req.params;
        try {
            const assignment = await AssignmentModel.getAssignmentById(assignmentId);

            if (!assignment) {
                return res.status(404).send('File not found');
            }

            // Set the response headers to indicate a PDF file for inline viewing
            res.setHeader('content-type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${assignment.assignment_file_name}"`);

            // Send the buffer content directly
            res.send(assignment.assignment_file);

        } catch (error) {
            console.error('Error viewing chapter:', error);
            res.status(500).json({ error: 'An error occurred while viewing the chapter' });
        }
    }
}

module.exports = AssignmentController;
