const conn = require('../config/db');

class ExamPreviewModel {
    static getExamPreview(examId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT e.exam_name, e.duration, e.start_at, q.question_text, q.points, a.answer_text, a.is_correct
            FROM exams as e 
            INNER JOIN questions as q ON e.exam_id = q.exam_id
            INNER JOIN answers as a ON q.question_id = a.question_id
            WHERE e.exam_id = ?
            `;
            conn.query(sql, [examId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = ExamPreviewModel;
