const conn = require('../config/db');

class QuestionModel {
    static addQuestion(exam_id, question_text, points) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO questions (exam_id, question_text, points) VALUES (?, ?, ?)';
            conn.query(sql, [exam_id, question_text, points], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    }
}

module.exports = QuestionModel;
