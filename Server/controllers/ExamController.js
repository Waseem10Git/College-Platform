// examController.js
const examModel = require('../models/Exam');

class ExamController {
    static async associateExamWithCourse(req, res) {
        const { course_code, instructor_id, exam_id } = req.body;

        try {
            await examModel.associateExamWithCourse(course_code, instructor_id, exam_id);
            res.json({ Status: "Success" });
        } catch (error) {
            console.error("Error associating exam with instructor's course:", error);
            res.status(500).json({ Error: "Error associating exam with instructor's course" });
        }
    }

    static async createExam(req, res) {
        const { exam_name, duration, start_at } = req.body;

        try {
            const examId = await examModel.createExam(exam_name, duration, start_at);
            res.json({ exam_id: examId });
        } catch (error) {
            console.error("Error inserting exam:", error);
            res.status(500).json({ Error: "Error inserting exam" });
        }
    }

    static async addQuestion(req, res) {
        const { exam_id, question_text, points } = req.body;

        try {
            const questionId = await examModel.addQuestion(exam_id, question_text, points);
            res.json({ question_id: questionId });
        } catch (error) {
            console.error("Error adding question:", error);
            res.status(500).json({ Error: "Error adding question" });
        }
    }

    static async addAnswer(req, res) {
        const { question_id, answer_text, is_correct } = req.body;

        try {
            const answerId = await examModel.addAnswer(question_id, answer_text, is_correct);
            res.json({ answer_id: answerId });
        } catch (error) {
            console.error("Error adding answer:", error);
            res.status(500).json({ Error: "Error adding answer" });
        }
    }
}

module.exports = ExamController;
