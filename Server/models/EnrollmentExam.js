const conn = require('../config/db');
class EnrollmentExamModel {
    static async associateExamWithEnrollment(course_code, instructor_id, exam_id) {
        const sql = `
            INSERT INTO enrollments_exams (enrollment_id, exam_id) 
            VALUES (
            (
            SELECT E.id FROM enrollments as E
            INNER JOIN instructors_courses as IC ON E.instructor_course_id = IC.id
            INNER JOIN departments_courses as DC ON IC.department_course_id = DC.id 
            WHERE DC.course_id = ? and IC.instructor_id = ?
            ), ?)`;

        return new Promise((resolve, reject) => {
            conn.query(sql, [course_code, instructor_id, exam_id], (err, result) => {
                if (err) {
                    return reject("Database error: " + err.message);
                }
                resolve(result);
            });
        });
    }
}

module.exports = EnrollmentExamModel;
