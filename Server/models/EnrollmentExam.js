const conn = require('../config/db');
class EnrollmentExamModel {
    static async associateExamWithEnrollment(course_code, instructor_id, exam_id) {
        const sql = `
            INSERT INTO enrollments_exams (enrollment_id, exam_id)
            SELECT E.id, ? 
            FROM enrollments AS E
            INNER JOIN instructors_courses AS IC ON E.instructor_course_id = IC.id
            INNER JOIN departments_courses AS DC ON IC.department_course_id = DC.id 
            WHERE DC.course_id = ? AND IC.instructor_id = ?`;

        return new Promise((resolve, reject) => {
            conn.query(sql, [exam_id, course_code, instructor_id], (err, result) => {
                if (err) {
                    return reject("Database error: " + err.message);
                }
                resolve(result);
            });
        });
    }

    static editStudentExamScore(studentExamId, score) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE enrollments_exams 
                SET score = ?
                WHERE id = ?
            `;
            conn.query(query, [score, studentExamId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            });
        });
    }

    static getStudentExamDetails(studentId, examId) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT
                exams.exam_id,
                exams.exam_name,
                questions.question_id,
                questions.question_text,
                questions.question_type,
                questions.points AS question_points,
                answers.answer_id,
                answers.answer_text,
                answers.is_correct AS is_answer_correct,
                student_answers.answer_text AS student_answer,
                student_answers.student_answer_points,
                student_answers.is_correct AS is_student_answer_correct,
                enrollments_exams.id as enrollment_exam_id,
                enrollments_exams.score AS student_exam_score
            FROM
                enrollments
            JOIN enrollments_exams ON enrollments.id = enrollments_exams.enrollment_id
            JOIN exams ON enrollments_exams.exam_id = exams.exam_id
            JOIN questions ON exams.exam_id = questions.exam_id
            LEFT JOIN answers ON questions.question_id = answers.question_id
            LEFT JOIN student_answers ON student_answers.enrollment_exam_id = enrollments_exams.id AND student_answers.question_id = questions.question_id
            WHERE
                enrollments.student_id = ? AND exams.exam_id = ?;
            `;
            conn.query(query, [studentId, examId], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static editEssayQuestionPoints(questionId, newQuestionPoints, enrollmentExamId) {
        return new Promise((resolve, reject) => {
            const query = `
            UPDATE student_answers
            SET student_answer_points = ?
            WHERE question_id = ? AND enrollment_exam_id = ?
            `;
            conn.query(query, [newQuestionPoints, questionId, enrollmentExamId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    static editStudentTotalScore(examId) {
        return new Promise((resolve, reject) => {
            const query = `
            UPDATE enrollments_exams ee
            SET ee.score = (
                SELECT SUM(COALESCE(sa.student_answer_points, 0))
                FROM student_answers sa
                INNER JOIN questions q ON sa.question_id = q.question_id
                WHERE sa.enrollment_exam_id = ee.id
            )
                WHERE ee.exam_id = ?;
            `;
            conn.query(query, [examId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0]);
            })
        })
    }

    static getQuestionType(questionId) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT
                question_type
            FROM
                questions
            WHERE
                question_id = ?
            `;
            conn.query(query, [questionId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].question_type);
            });
        });
    }

    static getQuestionPoints(questionId) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT
                points
            FROM
                questions
            WHERE
                question_id = ?
            `;
            conn.query(query, [questionId], (err, result) => {
                if (err) return reject(err);
                resolve(result[0].points);
            });
        });
    }
}

module.exports = EnrollmentExamModel;
