const StudentAnswerModel = require('../models/StudentAnswer');

class StudentAnswerController {
    static async submitStudentAnswers(req, res) {
        try {
            const { userId } = req.params;
            const { answers, examId } = req.body;

            // Check if exam is already submitted
            const checkResults = await StudentAnswerModel.checkSubmission(examId, userId);
            if (checkResults.length > 0 && checkResults[0].is_submitted) {
                return res.status(403).send('Exam already submitted');
            }

            // Insert student answers
            await StudentAnswerModel.insertAnswers(answers, examId, userId);

            // Mark exam as submitted
            await StudentAnswerModel.markExamAsSubmitted(examId, userId);

            return res.json({ message: 'Score updated and exam submitted successfully' });
        } catch (err) {
            console.error('Error handling student answers:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = StudentAnswerController;
