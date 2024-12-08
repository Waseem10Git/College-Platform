const EnrollmentExamModel = require('../models/EnrollmentExam');

class EnrollmentExamController {
    static async associateExamWithEnrollment(req, res) {
        const { course_code, instructor_id, exam_id } = req.body;

        try {
            // Associate the exam with the student's enrollment
            await EnrollmentExamModel.associateExamWithEnrollment(course_code, instructor_id, exam_id);

            res.json({ Status: "Success" });
        } catch (error) {
            console.error('Database error:', error);
            res.json({ Error: "Error associating exam with student's course" });
        }
    }

    static async editStudentExamScore(req, res) {
        const {studentExamId} = req.params;
        const {score} = req.body;

        try {
            if (!studentExamId){
                return res.status(404).json({error: 'There is data messing'});
            }

            if (!score && score < 0){
                return res.status(404).json({error: "Score can't be empty and can't be less than 0"});
            }

            await EnrollmentExamModel.editStudentExamScore(studentExamId, score);

            res.status(200).json({message: 'Editing score successfully'});
        } catch (err) {
            console.log('Error editing student exam score: ', err);
            res.status(404).json({error: "An error occurred while editing the student's exam score"});
        }
    }

    static async getStudentExamDetails(req, res) {
        const {studentId, examId} = req.params;
        try {
            if (!studentId || !examId){
                return res.status(404).json({error: 'There is data messing'});
            }

            const result = await EnrollmentExamModel.getStudentExamDetails(studentId, examId);

            return res.status(200).json(result);
        } catch (err) {
            console.log('Error fetching student exam details: ', err);
            res.status(404).json({error: "Error fetching student exam details"});
        }
    }
    static async editEssayQuestionPoints(req, res) {
        const {questionId} = req.params;
        const {newQuestionPoints, enrollmentExamId, examId} = req.body;
        try{
            if (!questionId || newQuestionPoints < 0 || !enrollmentExamId || !examId)
                return res.status(404).json({error: 'There is data messing'});

            const questionType = await EnrollmentExamModel.getQuestionType(questionId);

            if (questionType === 'MCQ')
                return res.status(404).json({error: "Can't edit MCQ points"});

            const questionPoints = await EnrollmentExamModel.getQuestionPoints(questionId);

            if (newQuestionPoints < 0 || newQuestionPoints > questionPoints)
                return res.status(404).json({error: `Points can't be less than 0 or greater than ${questionPoints}`});

            await EnrollmentExamModel.editEssayQuestionPoints(questionId, newQuestionPoints, enrollmentExamId);

            await EnrollmentExamModel.editStudentTotalScore(examId);

            res.status(200).json({message: 'Editing question point successfully'});
        } catch (err) {
            return res.status(500).json({ message: "Server Error in Editing Question Points: /api/editQuestionPoints" });
        }
    }

}

module.exports = EnrollmentExamController;
