const conn = require('../config/db');

class EnrollmentModel {
    static addStudentToCourse(student_id, course_id) {
        const sql = 'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            conn.query(sql, [student_id, course_id], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error adding student to course");
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = EnrollmentModel;