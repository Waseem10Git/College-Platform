const conn = require('../config/db');
class ExamResultModel {
    static getStudentsWithExams(examId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    u.id AS student_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
                    ee.id AS student_exam_id,
                    ee.is_submitted,
                    ee.score
                FROM 
                    enrollments_exams ee
                JOIN 
                    enrollments e ON ee.enrollment_id = e.id
                RIGHT JOIN 
                    users u ON e.student_id = u.id
                WHERE 
                    ee.exam_id = ?
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
