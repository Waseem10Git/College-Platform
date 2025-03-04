const conn = require('../config/db');
class InstructorCourseExamModel {
    static async associateExamWithCourse(course_code, instructor_id, exam_id) {
        const sql = `
            INSERT INTO instructors_courses_exams (instructors_courses_id, exam_id) 
            VALUES (
            (
            SELECT IC.id 
            FROM instructors_courses as IC
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

    static async deleteAssociationExamWithCourse(exam_id) {
        const sql = `
            DELETE FROM instructors_courses_exams WHERE exam_id = ?
            `;

        return new Promise((resolve, reject) => {
            conn.query(sql, [exam_id], (err, result) => {
                if (err) {
                    return reject("Database error: " + err.message);
                }
                resolve(result);
            });
        });
    }
}

module.exports = InstructorCourseExamModel;
