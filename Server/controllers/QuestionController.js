const QuestionModel = require('../models/Question');

class QuestionController {
    static async addQuestion(req, res) {
        try {
            const { exam_id, question_text, question_type, points } = req.body;
            const question_id = await QuestionModel.addQuestion(exam_id, question_text, question_type, points);
            return res.send({ question_id });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Server Error in POST Question with endpoint: /api/questions" });
        }
    }
}

module.exports = QuestionController;
