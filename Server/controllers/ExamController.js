const ExamModel = require('../models/Exam');
const conn = require('../config/db');
const InstructorCourseModel = require("../models/InstructorCourse");
const AssignmentModel = require("../models/Assignment");
const NotificationModel = require("../models/Notification");
const NotificationController = require("./NotificationController");

class ExamController {
    // static async createExam(req, res) {
    //     const { exam_name, duration, start_at } = req.body;
    //
    //     try {
    //         // Create a new exam
    //         const exam_id = await ExamModel.createExam(exam_name, duration, start_at);
    //
    //         res.json({ exam_id });
    //     } catch (error) {
    //         console.error('Error inserting exam:', error);
    //         res.json({ Error: "Error inserting exam" });
    //     }
    // }

    static async createExam(req, res) {
        const { exam_name, duration, start_at, selectedCourse, userId } = req.body;

        try {
            conn.beginTransaction(async (err) => {
                if (err) {
                    console.error('Transaction Error:', err);
                    return res.status(500).json({ error: 'Transaction Error' });
                }

                const result = await InstructorCourseModel.getInstructorCourseId(userId, selectedCourse);
                console.log(result)

                if (result.length === 0) {
                    return conn.rollback(() => {
                        console.error('No matching instructor_course_id found');
                        res.status(404).json({ error: 'No matching instructor_course_id found' });
                    });
                }

                const instructor_course_id = result[0].id;
                const courseName = result[0].course_name;

                await ExamModel.createExam(exam_name, duration, start_at);

                const notificationMessage = `New Exam added: ${courseName}`;
                await NotificationModel.createNotification(instructor_course_id, notificationMessage);

                conn.commit((err) => {
                    if (err) {
                        return conn.rollback(() => {
                            console.error('Transaction commit failed:', err);
                            res.status(500).json({ error: 'Transaction commit failed' });
                        });
                    }

                    // Emit notification event
                    const notificationController = new NotificationController();
                    notificationController.emitNotification(userId, notificationMessage);
                    res.json({ message: 'Exam added successfully' });
                });
            });
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
            const { courseId } = req.params;
            const examDetails = await ExamModel.getExamDetails(courseId);
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
        const { exam_name, duration, start_at, questions } = req.body;

        conn.beginTransaction(async (err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                return res.status(500).send({ message: 'Error starting transaction' });
            }

            try {
                await ExamModel.updateExam(examId, exam_name, duration, start_at);

                if (questions && questions.length > 0) {
                    for (const question of questions) {
                        await ExamModel.updateQuestion(question);
                        if (question.options && question.options.length > 0) {
                            for (const option of question.options) {
                                await ExamModel.updateOption(option);
                            }
                        }
                    }
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

module.exports = ExamController;
