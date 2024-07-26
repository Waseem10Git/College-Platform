const conn = require('../config/db');

class InstructorsCoursesModel {
    static async getInstructorsCourses() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT U.first_name, U.last_name, U.email, C.course_code, C.course_name FROM users AS U INNER JOIN instructors_courses AS IC ON U.id = IC.instructor_id INNER JOIN courses AS C ON IC.course_id = C.course_code";
            conn.query(sql, [], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static addInstructorToCourse(instructor_id, course_id) {
        const sql = 'INSERT INTO instructors_courses (instructor_id, course_id) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            conn.query(sql, [instructor_id, course_id], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error adding instructor to course");
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = InstructorsCoursesModel;