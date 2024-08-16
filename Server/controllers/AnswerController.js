const AnswerModel = require('../models/Answer');

class AnswerController {
    static async addAnswer(req, res) {
        try {
            const { question_id, answer_text, is_correct } = req.body;
            const answer_id = await AnswerModel.addAnswer(question_id, answer_text, is_correct);
            return res.send({ answer_id });
        } catch (err) {
            return res.status(500).json({ message: "Server Error in POST Answer with endpoint: /api/answers" });
        }
    }
}

module.exports = AnswerController;
