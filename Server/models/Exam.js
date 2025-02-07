const conn = require('../config/db');
class ExamModel {
    static async createExam(exam_name, duration, start_at, due_date, score) {
        const sql = "INSERT INTO exams (exam_name, duration, start_at, due_date, total_score) VALUES (?, ?, ?, ?, ?)";

        return new Promise((resolve, reject) => {
            conn.query(sql, [exam_name, duration, start_at, due_date, score], (err, result) => {
                if (err) {
                    return reject("Database error: " + err.message);
                }
                resolve(result.insertId);
            });
        });
    }

    static getExamsByCourse(courseId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT e.exam_id AS examId, e.exam_name AS examName, e.total_score AS examScore
            FROM exams AS e
            INNER JOIN instructors_courses_exams AS ice ON e.exam_id = ice.exam_id
            INNER JOIN instructors_courses AS ic ON ice.instructors_courses_id = ic.id
            INNER JOIN departments_courses AS dc ON ic.department_course_id = dc.id
            WHERE dc.course_id = ?
          `;
            conn.query(sql, [courseId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getExamDetails(courseId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT exam_name, duration, start_at, due_date
            FROM exams 
            WHERE exam_id = ?
          `;
            conn.query(sql, [courseId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getExamQuestions(examId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT e.exam_id, q.question_id, q.question_text, question_type, q.points
            FROM exams as e 
            INNER JOIN questions as q ON e.exam_id = q.exam_id
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

    static getExamAnswers(examId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT q.question_id, a.answer_id, a.answer_text, a.is_correct 
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

    static updateExam(examId, examName, duration, startAt, dueDate, totalScore) {
        return new Promise((resolve, reject) => {
            const sql = `
            UPDATE exams 
            SET exam_name = ?, duration = ?, start_at = ?, due_date = ?, total_score = ?
            WHERE exam_id = ?
          `;
            conn.query(sql, [examName, duration, startAt, dueDate, totalScore, examId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static updateQuestion(question) {
        return new Promise((resolve, reject) => {
            const sql = `
            UPDATE questions 
            SET question_text = ?, points = ? 
            WHERE question_id = ?
          `;
            conn.query(sql, [question.question_text, question.question_points, question.question_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static updateOption(option) {
        return new Promise((resolve, reject) => {
            const sql = `
            UPDATE answers 
            SET answer_text = ?, is_correct = ? 
            WHERE answer_id = ?
          `;
            conn.query(sql, [option.answer_text, option.is_correct, option.answer_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static deleteExam(examId) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM exams WHERE exam_id = ?';
            conn.query(sql, [examId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = ExamModel;
