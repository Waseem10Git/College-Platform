// models/StudentAssignmentModel.js
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

    static async insertStudentFile(enrollmentId, assignmentId, fileData, fileName) {
        const query = `
            INSERT INTO enrollments_assignments (enrollment_id, assignment_id, student_file, student_file_name)
            VALUES (?, ?, ?, ?)
        `;
        return await queryAsync(query, [enrollmentId, assignmentId, fileData, fileName]);
    }

    static async deleteFile(filePath) {
        const unlinkAsync = util.promisify(fs.unlink);
        await unlinkAsync(filePath);
    }

    static getStudentAssignmentById(studentAssignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT student_file_name, student_file FROM enrollments_assignments
                WHERE id = ?
                `;
            conn.query(query, [studentAssignmentId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
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
}

module.exports = StudentAssignmentModel;
