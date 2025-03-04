const ExamModel = require('../models/Exam');
const InstructorCourseExamModel = require('../models/InstructorCourseExam');
const EnrollmentExamModel = require('../models/EnrollmentExam');
const conn = require('../config/db');

class ExamController {
    static async createExam(req, res) {
        const { exam_name, duration, start_at, due_date, score } = req.body;

        try {
            const exam_id = await ExamModel.createExam(exam_name, duration, start_at, due_date, score);
            res.json({ message: 'Exam added successfully', exam_id });
        } catch (error) {
            console.error('Error inserting exam:', error);
            res.json({ Error: "Error inserting exam" });
        }
    }

    static async getExamsByCourse(req, res) {
        try {
            const { courseId } = req.params;
            const exams = await ExamModel.getExamsByCourse(courseId);
            return res.json(exams);
        } catch (err) {
            console.error('Error fetching exams:', err);
            return res.status(500).send('Server error');
        }
    }

    static async getExamDetails(req, res) {
        try {
            const { examId } = req.params;
            const examDetails = await ExamModel.getExamDetails(examId);
            return res.json(examDetails);
        } catch (err) {
            console.error('Error fetching exam details:', err);
            return res.status(500).send('Server error');
        }
    }

    static async getExamQuestions(req, res) {
        try {
            const { examId } = req.params;
            const questions = await ExamModel.getExamQuestions(examId);
            return res.json(questions);
        } catch (err) {
            console.error('Error fetching exam questions:', err);
            return res.status(500).send('Server error');
        }
    }

    static async getExamAnswers(req, res) {
        try {
            const { examId } = req.params;
            const answers = await ExamModel.getExamAnswers(examId);
            return res.json(answers);
        } catch (err) {
            console.error('Error fetching exam answers:', err);
            return res.status(500).send('Server error');
        }
    }

    static async editExam(req, res) {
        const { examId } = req.params;
        const { instructor_id, exam_name, new_course, duration, start_at, due_date, total_score, questions } = req.body;

        conn.beginTransaction(async (err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).send({ message: 'Error starting transaction' });
            }

            try {
                // Fetch existing questions and options
                const rawQuestions = await ExamModel.getExamQuestionsWithOptions(examId);
                const existingQuestions = formatQuestions(rawQuestions);
                console.log('Formatted Questions:', existingQuestions);

                // Track if score update is needed
                let scoreUpdateNeeded = false;

                // Update exam details
                await ExamModel.updateExam(examId, exam_name, duration, start_at, due_date, total_score);

                if (new_course) {
                    await InstructorCourseExamModel.deleteAssociationExamWithCourse(examId);
                    await InstructorCourseExamModel.associateExamWithCourse(new_course, instructor_id, examId);
                    await EnrollmentExamModel.deleteAssociationExamWithEnrollment(examId);
                    await EnrollmentExamModel.associateExamWithEnrollment(new_course, instructor_id, examId);
                }

                if (questions && questions.length > 0) {
                    for (const question of questions) {
                        // Find the matching existing question
                        const existingQuestion = existingQuestions.find(q => q.question_id === question.question_id);
                        console.log(existingQuestion)
                        if (existingQuestion) {
                            // Check if points have changed
                            if (existingQuestion.question_points !== question.question_points) {
                                scoreUpdateNeeded = true;
                            }

                            // Update question
                            await ExamModel.updateQuestion(question);

                            if (question.options && question.options.length > 0) {
                                for (const option of question.options) {
                                    // Find the matching existing option
                                    const existingOption = existingQuestion.options.find(o => o.answer_id === option.answer_id);

                                    if (existingOption) {
                                        // Check if correct answer has changed
                                        if (existingOption.is_correct !== option.is_correct) {
                                            scoreUpdateNeeded = true;
                                        }
                                    }

                                    // Update option
                                    await ExamModel.updateOption(option);
                                }
                            }
                        }
                    }
                }

                // If changes affect total score, update students' scores
                if (scoreUpdateNeeded) {
                    await EnrollmentExamModel.editStudentTotalScore(examId);
                }

                conn.commit((err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        return conn.rollback(() => {
                            res.status(500).send({ message: 'Error committing transaction' });
                        });
                    }
                    res.status(200).send({ message: 'Exam updated successfully' });
                });
            } catch (error) {
                console.error('Error during transaction:', error);
                conn.rollback(() => {
                    res.status(500).send({ message: 'Error during transaction' });
                });
            }
        });
    }

    static async deleteExam(req, res) {
        try {
            const { examId } = req.params;
            await ExamModel.deleteExam(examId);
            return res.json({ message: 'Exam deleted successfully' });
        } catch (err) {
            console.error('Error deleting exam:', err);
            return res.status(500).send('Server error');
        }
    }
}

function formatQuestions(rawData) {
    const questionsMap = {};

    rawData.forEach(row => {
        const { question_id, question_text, question_type, points, answer_id, answer_text, is_correct } = row;

        if (!questionsMap[question_id]) {
            // Initialize question structure
            questionsMap[question_id] = {
                question_id,
                question_text,
                question_type,
                points,
                options: []
            };
        }

        // Add options only for MCQ questions
        if (question_type === 'MCQ' && answer_id) {
            questionsMap[question_id].options.push({
                answer_id,
                answer_text,
                is_correct: Boolean(is_correct)
            });
        }
    });

    return Object.values(questionsMap); // Convert back to array
}

module.exports = ExamController;
