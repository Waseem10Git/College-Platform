const conn = require('../config/db');
const fs = require('fs');
const util = require('util');
const {promise} = require("bcrypt/promises");

const queryAsync = util.promisify(conn.query).bind(conn);

class AssignmentModel {
    static insertAssignment(assignmentName, assignmentDescription, fileName, filePath, fileSize, fileMimeType, dueDate) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO assignments (
                assignment_title,
                description, 
                assignment_file_name, 
                assignment_file_path, 
                assignment_file_size, 
                assignment_mime_type, 
                due_date
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            conn.query(query, [assignmentName, assignmentDescription, fileName, filePath, fileSize, fileMimeType, dueDate], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.insertId);
            });
        });
    }

    static associateAssignmentWithCourse(instructor_course_id, assignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO instructors_courses_assignments (instructors_courses_id, assignment_id)
                VALUES (?, ?)
            `;
            conn.query(query, [instructor_course_id, assignmentId], (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    }

    static associateAssignmentWithStudents(course_code, instructor_id, assignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO enrollments_assignments (enrollment_id, assignment_id)
                SELECT E.id, ? 
                FROM enrollments AS E
                INNER JOIN instructors_courses AS IC ON E.instructor_course_id = IC.id
                INNER JOIN departments_courses AS DC ON IC.department_course_id = DC.id 
                WHERE DC.course_id = ? AND IC.instructor_id = ?
            `;
            conn.query(query, [assignmentId, course_code, instructor_id], (err, result) => {
                if (err) {
                    console.error("Database error in associateAssignmentWithStudents:", err);
                    return reject("Database error: " + err.message);
                }
                if (result.affectedRows === 0) {
                    console.warn("No enrollments found for the given course and instructor.");
                    return reject("No enrollments found for the given course and instructor.");
                }
                console.log(`Inserted ${result.affectedRows} rows into enrollments_assignments`);
                resolve(result);
            });
        });
    }

    static cleanupTemporaryFile(filePath) {
        try {
            fs.unlinkSync(filePath);
        } catch (unlinkError) {
            console.error('Error deleting temporary file:', unlinkError);
        }
    }

    static getAssignmentsByCourseId(courseId) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT 
                a.assignment_id,
                a.assignment_title,
                a.description,
                a.due_date, 
                a.assignment_file_name, 
                a.assignment_file_path, 
                a.assignment_file_size, 
                a.assignment_mime_type, 
                ica.instructors_courses_id
            FROM assignments a
            JOIN instructors_courses_assignments ica ON a.assignment_id = ica.assignment_id
            JOIN instructors_courses ic ON ica.instructors_courses_id = ic.id
            JOIN departments_courses dc ON ic.department_course_id = dc.id 
            WHERE dc.course_id = ?
        `;
            conn.query(query, [courseId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    static getStudentsWithAssignments(assignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    u.id AS student_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
                    ea.id AS student_assignment_id,
                    ea.is_submitted,
                    ea.student_upload_time AS submission_date,
                    ea.student_file_name AS submitted_file_name,
                    ea.student_file_path,
                    ea.student_file_size,
                    ea.student_mime_type,
                    ea.score
                FROM 
                    enrollments_assignments ea
                JOIN 
                    enrollments e ON ea.enrollment_id = e.id
                RIGHT JOIN 
                    users u ON e.student_id = u.id
                WHERE 
                    ea.assignment_id = ?
            `;
            conn.query(query, [assignmentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getAssignmentById(assignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT
                assignment_file_name,
                assignment_file_path,
                assignment_file_size,
                assignment_mime_type
            FROM
                assignments
            WHERE
                assignment_id = ?
            `;
            conn.query(query, [assignmentId], (err, result) => {
                if (err)
                    return reject(err);
                resolve(result[0]);
            });
        });
    }

    static deleteAssignment(assignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM assignments WHERE assignment_id = ?
            `;
            conn.query(query, [assignmentId], (err, result) => {
                if (err)
                    return reject(err);
                resolve(result)
            })
        })
    }
}

module.exports = AssignmentModel;
