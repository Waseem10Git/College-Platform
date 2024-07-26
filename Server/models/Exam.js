// examModel.js
const conn = require('../config/db');

class ExamModel {
    static associateExamWithCourse(course_code, instructor_id, exam_id) {
        const sql = "INSERT INTO instructors_courses_exams (instructors_courses_id, exam_id) VALUES ((SELECT id FROM instructors_courses WHERE course_id = ? and instructor_id = ?), ?)";
        return new Promise((resolve, reject) => {
            conn.query(sql, [course_code, instructor_id, exam_id], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error associating exam with instructor's course");
                } else {
                    resolve(result);
                }
            });
        });
    }

    static createExam(exam_name, duration, start_at) {
        const sql = "INSERT INTO exams (exam_name, duration, start_at) VALUES (?, ?, ?)";
        return new Promise((resolve, reject) => {
            conn.query(sql, [exam_name, duration, start_at], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error inserting exam");
                } else {
                    resolve(result.insertId);
                }
            });
        });
    }

    static addQuestion(exam_id, question_text, points) {
        const sql = 'INSERT INTO questions (exam_id, question_text, points) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            conn.query(sql, [exam_id, question_text, points], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error adding question");
                } else {
                    resolve(result.insertId);
                }
            });
        });
    }

    static addAnswer(question_id, answer_text, is_correct) {
        const sql = 'INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            conn.query(sql, [question_id, answer_text, is_correct], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error adding answer");
                } else {
                    resolve(result.insertId);
                }
            });
        });
    }
}

module.exports = ExamModel;
