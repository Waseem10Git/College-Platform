const conn = require('../config/db');

class StudentExamStatusModel {
    static getExamStatus(userId, examId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT is_submitted FROM enrollments_exams 
            WHERE exam_id = ? AND enrollment_id = (
              SELECT E.id FROM enrollments as E
              INNER JOIN users as U ON E.student_id = U.id
              WHERE U.id = ?
            )
          `;
            conn.query(sql, [examId, userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = StudentExamStatusModel;
