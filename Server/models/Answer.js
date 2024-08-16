const conn = require('../config/db');

class AnswerModel {
    static addAnswer(question_id, answer_text, is_correct) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)';
            conn.query(sql, [question_id, answer_text, is_correct], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId);
            });
        });
    }
}

module.exports = AnswerModel;
