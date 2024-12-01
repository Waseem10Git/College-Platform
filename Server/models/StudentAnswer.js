const conn = require('../config/db');

class StudentAnswerModel {
    static checkSubmission(examId, userId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT is_submitted 
            FROM enrollments_exams 
            WHERE exam_id = ? 
            AND enrollment_id IN (
                SELECT DISTINCT E.id 
                FROM enrollments as E
                INNER JOIN users as U ON E.student_id = U.id
                INNER JOIN enrollments_exams as ee ON E.id = ee.enrollment_id
                WHERE U.id = ? AND ee.exam_id = ?
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

    static insertAnswers(answers, examId, userId) {
        console.log(examId)
        const insertAnswerPromises = answers.map(answer => {
            const { questionId, answerText, isCorrect, studentQuestionPoints } = answer;
            const sql = `
            INSERT INTO student_answers (question_id, answer_text, is_correct, student_answer_points, enrollment_exam_id)
            VALUES (?, ?, ?, ?, (
              SELECT ee.id FROM enrollments_exams as ee 
              INNER JOIN enrollments as e ON ee.enrollment_id = e.id
              WHERE ee.exam_id = ? AND e.student_id = ?
            )) 
          `;
            return new Promise((resolve, reject) => {
                conn.query(sql, [questionId, answerText, isCorrect, studentQuestionPoints, examId, userId], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
        return Promise.all(insertAnswerPromises);
    }

    static setSubmissionAndScore(examId, userId, score) {
        const sql = `
        UPDATE enrollments_exams
        SET is_submitted = 1, score = ?
        WHERE exam_id = ? 
        AND enrollment_id IN (
          SELECT E.id 
                FROM enrollments as E
                INNER JOIN enrollments_exams as ee ON E.id = ee.enrollment_id
                WHERE E.student_id = ? AND ee.exam_id = ?
        )
      `;
        return new Promise((resolve, reject) => {
            conn.query(sql, [score, examId, userId, examId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = StudentAnswerModel;
