const QuestionModel = require('../models/Question');

class QuestionController {
    static async addQuestion(req, res) {
        try {
            const { exam_id, question_text, points } = req.body;
            const question_id = await QuestionModel.addQuestion(exam_id, question_text, points);
            return res.send({ question_id });
        } catch (err) {
            return res.status(500).json({ message: "Server Error in POST Question with endpoint: /api/questions" });
        }
    }
}

module.exports = QuestionController;
