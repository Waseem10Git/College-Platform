const conn = require('../config/db');

class StudentAnswerModel {
    static checkSubmission(examId, userId) {
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

    static insertAnswers(answers, examId, userId) {
        const insertAnswerPromises = answers.map(answer => {
            const { questionId, answerText, isCorrect } = answer;
            const sql = `
            INSERT INTO student_answers (question_id, answer_text, is_correct, enrollment_exam_id)
            VALUES (?, ?, ?, (
              SELECT ee.id FROM enrollments_exams as ee 
              INNER JOIN enrollments as e ON ee.enrollment_id = e.id
              WHERE ee.exam_id = ? AND e.student_id = ?
            )) 
          `;
            return new Promise((resolve, reject) => {
                conn.query(sql, [questionId, answerText, isCorrect, examId, userId], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
        return Promise.all(insertAnswerPromises);
    }

    static markExamAsSubmitted(examId, userId) {
        const sql = `
        UPDATE enrollments_exams
        SET is_submitted = 1
        WHERE exam_id = ? AND enrollment_id = (
          SELECT E.id FROM enrollments as E
          INNER JOIN users as U ON E.student_id = U.id
          WHERE U.id = ?
        )
      `;
        return new Promise((resolve, reject) => {
            conn.query(sql, [examId, userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = StudentAnswerModel;
