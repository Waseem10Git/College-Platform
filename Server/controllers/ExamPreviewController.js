const ExamPreviewModel = require('../models/ExamPreview');

class ExamPreviewController {
    static async getExamPreview(req, res) {
        try {
            const { examId } = req.params;
            const previewData = await ExamPreviewModel.getExamPreview(examId);
            return res.json(previewData);
        } catch (err) {
            console.error('Error fetching exam to Preview:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = ExamPreviewController;
