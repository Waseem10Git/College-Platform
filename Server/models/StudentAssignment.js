const conn = require('../config/db');
const fs = require('fs');
const util = require('util');

const queryAsync = util.promisify(conn.query).bind(conn);

class StudentAssignmentModel {
    static async getEnrollmentId(userId, instructorCourseId) {
        const query = `
            SELECT id FROM enrollments 
            WHERE student_id = ? AND instructor_course_id = ?
        `;
        return await queryAsync(query, [userId, instructorCourseId]);
    }

    static async insertStudentFile(enrollmentId, assignmentId, fileName, mimetype, size, filePath) {
        const query = `
            UPDATE
                enrollments_assignments
            SET
                student_file_name = ?,
                student_file_path = ?,
                student_file_size = ?,
                student_mime_type = ?,
                student_upload_time = NOW(), 
                is_submitted = TRUE
            WHERE
                enrollment_id = ? AND assignment_id = ?
        `;
        return await queryAsync(query, [fileName, filePath, size, mimetype, enrollmentId, assignmentId]);
    }

    static async deleteFile(filePath) {
        const unlinkAsync = util.promisify(fs.unlink);
        await unlinkAsync(filePath);
    }

    static getStudentAssignmentById(studentAssignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT student_file_name, student_file_path, student_mime_type, student_file_size FROM enrollments_assignments
                WHERE id = ?
                `;
            conn.query(query, [studentAssignmentId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        });
    }

    static getAssignmentSubmission(assignmentId, studentId, instructorCourseId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                is_submitted
            FROM
                enrollments_assignments
            WHERE
                assignment_id = ? AND enrollment_id = (
                SELECT
                    id
                FROM
                    enrollments
                WHERE
                    student_id = ? AND instructor_course_id = ?
                )
                `;
            conn.query(query, [assignmentId, studentId, instructorCourseId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].is_submitted);
            })
        });
    }

    static editStudentAssignmentScore(studentAssignmentId, score) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE enrollments_assignments 
                SET score = ?
                WHERE id = ?
            `;
            conn.query(query, [score, studentAssignmentId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }

    static getStudentAssignmentScore(studentId, assignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    ea.score
                FROM 
                    enrollments_assignments ea
                INNER JOIN 
                    enrollments e ON ea.enrollment_id = e.id
                INNER JOIN 
                    users u ON e.student_id = u.id
                WHERE 
                    u.id = ? AND ea.assignment_id = ?;
            `;
            conn.query(query, [studentId, assignmentId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }
}

module.exports = StudentAssignmentModel;
