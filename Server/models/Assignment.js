const conn = require('../config/db');
const fs = require('fs');
// const path = require('path');
const util = require('util');

const queryAsync = util.promisify(conn.query).bind(conn);

class AssignmentModel {

    // For upload assignment


    // For upload assignment
    static insertAssignment(assignmentName, assignmentDescription, assignmentFile, fileData, dueDate) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO assignments (assignment_title, description, assignment_file_name, assignment_file, due_date)
                VALUES (?, ?, ?, ?, ?)
            `;
            conn.query(query, [assignmentName, assignmentDescription, assignmentFile, fileData, dueDate], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.insertId);
            });
        });
    }

    // For upload assignment
    static associateAssignmentWithCourse(instructor_course_id, assignmentId) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO instructors_courses_assignments (instructor_course_id, assignment_id)
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

    // For upload assignment


    // For upload assignment
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
            SELECT a.assignment_id, a.assignment_title, a.description, ica.instructor_course_id
            FROM assignments a
            JOIN instructors_courses_assignments ica ON a.assignment_id = ica.assignment_id
            JOIN instructors_courses ic ON ica.instructor_course_id = ic.id
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
                SELECT u.id, u.first_name, u.last_name, ea.student_file_name AS assignment_file_name, ea.student_file AS assignment_file, ea.created_at AS uploaded_at, ea.score
                FROM enrollments_assignments ea
                RIGHT JOIN enrollments e ON ea.enrollment_id = e.id
                JOIN instructors_courses ic ON e.instructor_course_id = ic.id
                JOIN instructors_courses_assignments ica ON ic.id = ica.instructor_course_id
                RIGHT JOIN users u ON e.student_id = u.id
                WHERE ica.assignment_id = ? 
            `;
            conn.query(query, [assignmentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = AssignmentModel;
