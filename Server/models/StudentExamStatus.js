const conn = require('../config/db');

class StudentExamStatusModel {
    static getExamStatus(userId, examId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT is_submitted 
            FROM enrollments_exams 
            WHERE exam_id = ? 
            AND enrollment_id IN (
                SELECT E.id 
                FROM enrollments as E
                INNER JOIN enrollments_exams as ee ON E.id = ee.enrollment_id
                WHERE E.student_id = ? AND ee.exam_id = ?
            )
          `;
            conn.query(sql, [examId, userId, examId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = StudentExamStatusModel;
