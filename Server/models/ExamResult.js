const conn = require('../config/db');
class ExamResultModel {
    static getExamResultsByExamId(examId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.id, u.first_name, u.last_name, ee.score, ee.is_submitted
                FROM enrollments_exams ee
                JOIN enrollments e ON ee.enrollment_id = e.id
                RIGHT JOIN users u ON e.student_id = u.id
                WHERE ee.exam_id = ?
            `;
            conn.query(query, [examId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static updateExamScore(enrollmentId, examId, score) {
        return new Promise((resolve, reject) => {
            const sql = `
            UPDATE enrollments_exams 
            SET score = ? 
            WHERE enrollment_id = ? AND exam_id = ?
          `;
            conn.query(sql, [score, enrollmentId, examId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = ExamResultModel;
