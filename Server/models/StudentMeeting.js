const conn = require('../config/db');

class StudentMeetingModel {
    static getMeetingId(studentId, courseId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT ic.meeting_id 
                FROM enrollments as e 
                INNER JOIN instructors_courses as ic ON e.instructor_course_id = ic.id
                INNER JOIN departments_courses as dc ON ic.department_course_id = dc.id
                WHERE e.student_id = ? AND dc.course_id = ?
            `;
            conn.query(sql, [studentId, courseId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
    }
}

module.exports = StudentMeetingModel;
