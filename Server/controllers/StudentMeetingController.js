const StudentMeetingModel = require('../models/StudentMeeting');

class StudentMeetingController {
    static async getMeetingId(req, res) {
        try {
            const { studentId, courseId } = req.params;
            const result = await StudentMeetingModel.getMeetingId(studentId, courseId);

            if (result) {
                return res.json(result);
            } else {
                return res.status(404).send('Meeting ID not found');
            }
        } catch (err) {
            console.error('Error getting meeting ID:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = StudentMeetingController;
