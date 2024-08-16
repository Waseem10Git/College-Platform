const StudentExamStatusModel = require('../models/StudentExamStatus');

class StudentExamStatusController {
    static async getExamStatus(req, res) {
        try {
            const { userId, examId } = req.params;
            const results = await StudentExamStatusModel.getExamStatus(userId, examId);
            if (results.length > 0) {
                return res.json({ is_submitted: results[0].is_submitted });
            } else {
                return res.json({ is_submitted: false });
            }
        } catch (err) {
            console.error('Error checking submission:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = StudentExamStatusController;
