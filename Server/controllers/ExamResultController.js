const ExamResultModel = require('../models/ExamResult');

class ExamResultController {
    static async getStudentsWithExams(req, res) {
        const { examId } = req.params;

        try {
            const examResults = await ExamResultModel.getStudentsWithExams(examId);
            return res.status(200).json(examResults);
        } catch (err) {
            console.error('Error fetching exam results:', err);
            return res.status(500).json({ message: 'Error fetching exam results' });
        }
    }

    static async updateExamScore(req, res) {
        try {
            const { enrollmentId, examId } = req.params;
            const { score } = req.body;
            await ExamResultModel.updateExamScore(enrollmentId, examId, score);
            return res.json({ message: 'Score updated successfully' });
        } catch (err) {
            console.error('Error updating exam score:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = ExamResultController;
