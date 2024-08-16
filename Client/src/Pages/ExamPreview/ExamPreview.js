import React, { useState, useEffect } from 'react';
import styles from './ExamPreview.module.css';
import axios from '../../api/axios';
import CourseSelect from '../ExamResults/CourseSelect';
import ExamSelect from '../ExamResults/ExamSelect';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";

function ExamPreviewPage({ isDarkMode, language, Role, userId }) {
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [examDetails, setExamDetails] = useState({});
    const [examQuestions, setExamQuestions] = useState([]);
    const [examAnswers, setExamAnswers] = useState([]);
    const [examName, setExamName] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
    const [duration, setDuration] = useState(0);
    const [startAt, setStartAt] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get(`/api/instructor/${userId}/courses`);
            if (Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                console.error('Expected array but got:', response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    const handleCourseSelect = (courseId) => {
        axios.get(`/api/exams/${courseId}`)
            .then(response => {
                setExams(response.data);
            })
            .catch(error => {
                console.error('Error fetching exams:', error);
            });
    };

    const fetchExamDetails = async (examId) => {
        axios.get(`/api/exams-details/${examId}`)
            .then(response => {
                const details = response.data[0];
                setExamDetails(details);
                setExamName(details.exam_name);
                setDuration(details.duration);
                setStartAt(new Date(details.start_at));
            })
            .catch(error => {
                console.error('Error fetching exam details:', error);
            });
    }

    const fetchExamQuestions = async (examId) => {
        await axios.get(`/api/exams-questions/${examId}`)
            .then(response => {
                setExamQuestions(response.data);
            })
            .catch(error => {
                console.error('Error fetching exam questions:', error);
            });
    }

    const fetchExamAnswers = async (examId) => {
        await axios.get(`/api/exams-answers/${examId}`)
            .then(response => {
                setExamAnswers(response.data);
            })
            .catch(error => {
                console.error('Error fetching exam answers:', error);
            });
    }

    const handleExamSelect = (examId) => {
        setSelectedExamId(examId);
        fetchExamDetails(examId);
        fetchExamQuestions(examId);
        fetchExamAnswers(examId);
    };

    const toggleEditMode = () => {
        setEditMode(prevMode => !prevMode);
    };

    const handleEditSubmit = () => {
        console.log("examQuestions: ", examQuestions)
        const startAtUTC = moment(startAt).format();
        const updatedExam = {
            exam_name: examName,
            duration: duration,
            start_at: startAtUTC,
            questions: examQuestions.map(question => ({
                question_id: question.question_id,
                question_text: question.question_text,
                question_points:question.points,
                options: examAnswers
                    .filter(answer => answer.question_id === question.question_id)
                    .map(answer => ({
                        answer_id: answer.answer_id,
                        answer_text: answer.answer_text,
                        is_correct: answer.is_correct
                    }))
            }))
        };
        console.log("updated exam: ", updatedExam)

        axios.put(`/api/exams/${selectedExamId}`, updatedExam)
            .then(response => {
                setExamDetails(response.data);
                fetchExamDetails(selectedExamId);
                setEditMode(false);
            })
            .catch(error => {
                console.error('Error updating exam:', error);
            });
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...examQuestions];
        updatedQuestions[index].question_text = value;
        setExamQuestions(updatedQuestions);
    };

    const handleQuestionPointsChange = (index, value) => {
        const updatedQuestions = [...examQuestions];
        updatedQuestions[index].points = value;
        setExamQuestions(updatedQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const questionId = examQuestions[questionIndex].question_id;
        const updatedAnswers = [...examAnswers];
        const answersForQuestion = updatedAnswers.filter(answer => answer.question_id === questionId);

        if (answersForQuestion[optionIndex]) {
            answersForQuestion[optionIndex].answer_text = value;
            setExamAnswers(updatedAnswers);
        } else {
            console.error('Answer not found for the given indices.');
        }
    };

    const handleDeleteExam = () => {
        axios.delete(`/api/exams/${selectedExamId}`)
            .then(response => {
                setExamDetails({});
                setEditMode(false);
                setExams(exams.filter(exam => exam.exam_id !== selectedExamId));
                setSelectedExamId('');
                setCourses([]);
                fetchData();
            })
            .catch(error => {
                console.error('Error deleting exam:', error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() - 3);
        return date.toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            {!editMode ? (
                <div className={"select-container"}>
                    <CourseSelect courses={courses} onSelect={handleCourseSelect} language={language} />
                    <ExamSelect exams={exams} onSelect={handleExamSelect} language={language} />
                </div>
            ) : null}
            <div className={styles.examContainer}>
                <div>
                    {editMode && exams.length > 0 ? (
                        <div>
                            <h2>Editing Exam</h2>
                            <div className="exam-container">
                                <div className="input-wrapper">
                                    <label className="input-label">
                                        {language === 'En' ? 'Exam Name:' : 'اسم الامتحان'}
                                    </label>
                                    <input
                                        type="text"
                                        value={examName}
                                        onChange={(e) => setExamName(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label className="input-label">
                                        {language === 'En' ? 'Duration:' : 'مدة الامتحان'}
                                    </label>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="input-field"
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <label className="input-label">
                                        {language === 'En' ? 'Start At:' : 'تاريخ البدء'}
                                    </label>
                                    <DatePicker
                                        selected={startAt}
                                        onChange={(date) => setStartAt(date)}
                                        showTimeSelect
                                        dateFormat="Pp"
                                        className="input-field"
                                        minDate={new Date()}
                                        required
                                    />
                                </div>
                                {examQuestions.map((question, questionIndex) => {
                                    const answersForQuestion = examAnswers.filter(
                                        (answer) => answer.question_id === question.question_id
                                    );
                                    return (
                                        <div key={questionIndex} className="question-edit">
                                            <div className="input-wrapper">
                                                <label className="input-label" style={{borderTop: '1px solid #ccc'}}>
                                                    {language === 'En' ? `Question ${questionIndex + 1}:` : `السؤال ${questionIndex + 1}:`}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.question_text}
                                                    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                                    className="input-field"
                                                />
                                            </div>
                                            {answersForQuestion.map((answer, answerIndex) => (
                                                <div key={answerIndex} className="input-wrapper">
                                                    <label className="input-label">
                                                        {language === 'En' ? `Option ${answerIndex + 1}:` : `اختيار ${answerIndex + 1}:`}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={answer.answer_text}
                                                        onChange={(e) => handleOptionChange(questionIndex, answerIndex, e.target.value)}
                                                        className="input-field"
                                                    />
                                                </div>
                                            ))}
                                            {/*new input to handle points of the question*/}
                                            <div className="input-wrapper">
                                                <label className="input-label">
                                                    {language === 'En' ? `Points:` : `الدرجة:`}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.points}
                                                    onChange={(e) => handleQuestionPointsChange(questionIndex, e.target.value)}
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <button onClick={handleEditSubmit} className="submit-edit-button">
                                    {language === 'En' ? 'Submit Edit' : 'إرسال التعديل'}
                                </button>
                                <button className={styles.editButton} onClick={toggleEditMode}>
                                    {language === 'En' ? 'Cancel Edit' : 'الغاء التعديل'}
                                </button>
                            </div>
                        </div>
                    ) : null}
                    {selectedExamId && !editMode && (
                        <div className={"exam-container"}>
                            <div className="exam-details">
                                <div className={"input-wrapper"}>
                                <h3>{examDetails.exam_name}</h3>
                                </div>
                                <div className={"input-wrapper"}>
                                    <p>Duration: {examDetails.duration} minutes</p>
                                </div>
                                <div className={"input-wrapper"}>
                                    <p>{`Start Time: ${formatDate(examDetails.start_at)}`}</p>
                                </div>
                            </div>
                            {examQuestions.map((question, questionIndex) => {
                                const isMCQ = examAnswers.some(
                                    (answer) => answer.question_id === question.question_id
                                );
                                return (
                                    <div className="question-item" key={questionIndex}>
                                        <h3>{question.question_text} ?</h3>
                                        {isMCQ ? (
                                            examAnswers
                                                .filter((answer) => answer.question_id === question.question_id)
                                                .map((answer, answerIndex) => (
                                                    <div key={answerIndex}>
                                                        Option {answerIndex + 1}: {answer.answer_text}
                                                    </div>
                                                ))
                                        ) : null}
                                        <p>Point({question.points})</p>
                                    </div>
                                );
                            })}
                            <button className={styles.editButton} onClick={toggleEditMode}>
                                Edit Exam
                            </button>
                            <button onClick={handleDeleteExam} className="delete-button">
                                {language === 'En' ? 'Delete Exam' : 'حذف الامتحان'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExamPreviewPage;
