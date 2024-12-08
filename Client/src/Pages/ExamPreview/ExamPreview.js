import React, {useState, useEffect, useContext} from 'react';
import  './ExamPreview.css';
import axios from '../../api/axios';
import CourseSelect from '../ExamResults/CourseSelect';
import ExamSelect from '../ExamResults/ExamSelect';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";
import UserContext from "../../context/UserContext";

function ExamPreviewPage() {
    const { isDarkMode, language, userId } = useContext(UserContext);
    const [courses, setCourses] = useState([]);
    const [exams, setExams] = useState([]);
    const [examDetails, setExamDetails] = useState({});
    const [examQuestions, setExamQuestions] = useState([]);
    const [examAnswers, setExamAnswers] = useState([]);
    const [examName, setExamName] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [duration, setDuration] = useState(0);
    const [startAt, setStartAt] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isExamStarted, setIsExamStarted] = useState(false);

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date()); // Update the current time every second
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    useEffect(() => {
        if (currentTime && startAt) {
            setIsExamStarted(currentTime >= startAt);
        }
    }, [currentTime, startAt, selectedExamId]);

    const handleCourseSelect = (courseId) => {
        setSelectedCourseId(courseId);
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
                console.log('answers:', response.data);
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
        const startAtUTC = moment(startAt).format();
        const updatedExam = {
            exam_name: examName,
            duration: duration,
            start_at: startAtUTC,
            questions: examQuestions.map((question) => ({
                question_id: question.question_id,
                question_text: question.question_text,
                question_points: question.points,
                options: examAnswers
                    .filter((answer) => answer.question_id === question.question_id)
                    .map((answer) => ({
                        answer_id: answer.answer_id,
                        answer_text: answer.answer_text,
                        is_correct: answer.is_correct,
                    })),
            })),
        };

        axios.put(`/api/exams/${selectedExamId}`, updatedExam)
            .then((response) => {
                setExamDetails(response.data);
                fetchExamDetails(selectedExamId);
                setEditMode(false);
                setSelectedCourseId('');
            })
            .catch((error) => {
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
        updatedQuestions[index].points = parseInt(value);
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

    const handleCorrectAnswerChange = (questionIndex, answerId) => {
        const updatedAnswers = examAnswers.map((answer) =>
            answer.question_id === examQuestions[questionIndex].question_id
                ? { ...answer, is_correct: answer.answer_id === answerId ? 1 : 0 }
                : answer
        );
        setExamAnswers(updatedAnswers);
    };

    const handleDeleteExam = () => {
        axios.delete(`/api/exams/${selectedExamId}`)
            .then(response => {
                setExamDetails({});
                setEditMode(false);
                setExams(exams.filter(exam => exam.exam_id !== selectedExamId));
                setSelectedExamId('');
                setSelectedCourseId('');
                setCourses([]);
                setExams([]);
                fetchData();
            })
            .catch(error => {
                console.error('Error deleting exam:', error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours());
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
                <div className={"ExamPreviewPage_select-container"}>
                    <CourseSelect courses={courses} onSelect={handleCourseSelect} selectedCourse={selectedCourseId}/>
                    <ExamSelect exams={exams} onSelect={handleExamSelect} language={language} />
                </div>
            ) : null}
            <div className={"ExamPreviewPage_examContainer"}>
                <div>
                    {editMode && exams.length > 0 ? (
                        <div>
                            <h2>Editing Exam</h2>
                            <div className="ExamPreviewPage_exam-container">
                                <div className="ExamPreviewPage_input-wrapper">
                                    <label className="ExamPreviewPage_input-label">
                                        {language === 'En' ? 'Exam Name:' : 'اسم الامتحان'}
                                    </label>
                                    <input
                                        type="text"
                                        value={examName}
                                        onChange={(e) => setExamName(e.target.value)}
                                        className="ExamPreviewPage_input-field"
                                    />
                                </div>
                                <div className="ExamPreviewPage_inputRow">
                                    <div className="ExamPreviewPage_input-wrapper">
                                        <label className="ExamPreviewPage_input-label">
                                            {language === 'En' ? 'Duration:' : 'مدة الامتحان'}
                                        </label>
                                        <input
                                            type="number"
                                            value={duration}
                                            onChange={(e) => setDuration(parseInt(e.target.value))}
                                            className="ExamPreviewPage_input-field"
                                        />
                                    </div>
                                    <div className="ExamPreviewPage_input-wrapper">
                                        <label className="ExamPreviewPage_input-label" style={{display: 'block'}}>
                                            {language === 'En' ? 'Start At:' : 'تاريخ البدء'}
                                        </label>
                                        <DatePicker
                                            selected={startAt}
                                            onChange={(date) => setStartAt(date)}
                                            showTimeSelect
                                            dateFormat="Pp"
                                            className="ExamPreviewPage_input-field ExamPreviewPage_customWidth"
                                            minDate={new Date()}
                                            minTime={
                                                startAt && startAt.toDateString() === new Date().toDateString()
                                                    ? new Date()  // If today, set minTime to now
                                                    : new Date(new Date().setHours(0, 0, 0, 0))  // If another day, set minTime to start of day
                                            }
                                            maxTime={new Date(new Date().setHours(23, 59, 59, 999))} // Max time is the end of the day
                                            required
                                        />

                                    </div>
                                </div>
                                {examQuestions.map((question, questionIndex) => {
                                    const answersForQuestion = examAnswers.filter(
                                        (answer) => answer.question_id === question.question_id
                                    );
                                    return (
                                        <div key={questionIndex} className="ExamPreviewPage_question-edit">
                                            <div className="ExamPreviewPage_input-wrapper">
                                                <label className="ExamPreviewPage_input-question-label">
                                                    {language === 'En' ? `Question ${questionIndex + 1}:` : `السؤال ${questionIndex + 1}:`}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.question_text}
                                                    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                                    className="ExamPreviewPage_input-field"
                                                />
                                            </div>
                                            {answersForQuestion.map((answer, answerIndex) => (
                                                <div key={answerIndex} className="ExamPreviewPage_input-wrapper">
                                                    <label className="ExamPreviewPage_input-label">
                                                        {language === 'En' ? `Option ${answerIndex + 1}:` : `اختيار ${answerIndex + 1}:`}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={answer.answer_text}
                                                        onChange={(e) => handleOptionChange(questionIndex, answerIndex, e.target.value)}
                                                        className="ExamPreviewPage_input-field"
                                                    />
                                                </div>
                                            ))}
                                            {answersForQuestion.length > 0 && (
                                                <div className="ExamPreviewPage_input-wrapper">
                                                    <label className="ExamPreviewPage_input-label">
                                                        {language === 'En' ? `Correct Answer:` : `الإختيار الصحيح:`}
                                                    </label>
                                                    <select
                                                        value={
                                                            answersForQuestion.find((answer) => answer.is_correct === 1)?.answer_id || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleCorrectAnswerChange(questionIndex, parseInt(e.target.value))
                                                        }
                                                        className="ExamPreviewPage_select"
                                                    >
                                                        {answersForQuestion.map((answer) => (
                                                            <option key={answer.answer_id} value={answer.answer_id}>
                                                                {answer.answer_text}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}


                                            {/*new input to handle points of the question*/}
                                            <div className="ExamPreviewPage_input-wrapper">
                                                <label className="ExamPreviewPage_input-label">
                                                    {language === 'En' ? `Points:` : `الدرجة:`}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={question.points}
                                                    onChange={(e) => handleQuestionPointsChange(questionIndex, e.target.value)}
                                                    className="ExamPreviewPage_input-field"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <button onClick={handleEditSubmit} className="ExamPreviewPage_submit-edit-button">
                                    {language === 'En' ? 'Submit Edit' : 'إرسال التعديل'}
                                </button>
                                <button className={"ExamPreviewPage_editButton"} onClick={toggleEditMode}>
                                    {language === 'En' ? 'Cancel Edit' : 'الغاء التعديل'}
                                </button>
                            </div>
                        </div>
                    ) : null}
                    {selectedExamId && !editMode && (
                        <div className={"ExamPreviewPage_exam-container"}>
                            <div className="ExamPreviewPage_exam-details">
                            <div className={"ExamPreviewPage_input-wrapper"}>
                                    <h3>{examDetails.exam_name}</h3>
                                </div>
                                <div className={"ExamPreviewPage_input-wrapper"}>
                                    <p>Duration: {examDetails.duration} minutes</p>
                                </div>
                                <div className={"ExamPreviewPage_input-wrapper"}>
                                    <p>{`Start Time: ${formatDate(examDetails.start_at)}`}</p>
                                </div>
                            </div>
                            {examQuestions.map((question, questionIndex) => {
                                const isMCQ = examAnswers.some(
                                    (answer) => answer.question_id === question.question_id
                                );
                                return (
                                    <div className="ExamPreviewPage_question-item" key={questionIndex}>
                                        <h3>{question.question_text} ?</h3>
                                        {isMCQ ? (
                                            examAnswers
                                                .filter((answer) => answer.question_id === question.question_id)
                                                .map((answer, answerIndex) => (
                                                    <div key={answerIndex} style={{marginLeft: answer.is_correct === 1 ? '66px' : ''}}>
                                                        Option {answerIndex + 1}: {answer.answer_text} {answer.is_correct === 1 ? ('{Correct}') : null}
                                                    </div>
                                                ))
                                        ) : null}
                                        <p>Point({question.points})</p>
                                    </div>
                                );
                            })}
                            {!isExamStarted && (
                                <>
                                    <button className={"ExamPreviewPage_editButton"} onClick={toggleEditMode}>
                                        Edit Exam
                                    </button>
                                </>
                            )}
                            <button onClick={handleDeleteExam} className="ExamPreviewPage_delete-button">
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
