import React, {useState, useEffect, useContext, useMemo} from 'react';
import  './ExamPreview.css';
import axios from '../../api/axios';
import CourseSelect from '../ExamResults/CourseSelect';
import ExamSelect from '../ExamResults/ExamSelect';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";
import UserContext from "../../context/UserContext";
import {ConfirmDelete} from "../../components";

function ExamPreviewPage() {
    const { isDarkMode, language, userId } = useContext(UserContext);
    const [courses, setCourses] = useState([]);
    const [preCourse, setPreCourse] = useState('');
    const [newCourse, setNewCourse] = useState(null);
    const [exams, setExams] = useState([]);
    const [examDetails, setExamDetails] = useState({});
    const [examQuestions, setExamQuestions] = useState([]);
    const [examAnswers, setExamAnswers] = useState([]);
    const [examName, setExamName] = useState('');
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [duration, setDuration] = useState(0);
    const [startAt, setStartAt] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [deletionVisible, setDeletionVisible] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [isLoadingAnswers, setIsLoadingAnswers] = useState(false);
    const [isExamEnded, setIsExamEnded] = useState(false);

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
        if (currentTime && startAt && dueDate) {
            if (startAt <= currentTime && currentTime < dueDate) {
                setIsExamStarted(true);
            } else {
                setIsExamEnded(true);
                setIsExamStarted(false);
            }
        }
    }, [currentTime, startAt, selectedExamId]);

    const handleCourseSelect = (courseId) => {
        setSelectedCourseId(courseId);
        setPreCourse(courseId);
        setSelectedExamId('');
        axios.get(`/api/exams/${courseId}`)
            .then(response => {
                setExams(response.data);
            })
            .catch(error => {
                console.error('Error fetching exams:', error);
            });
    };

    const fetchExamDetails = async (examId) => {
        setIsLoadingDetails(true);
        await axios.get(`/api/exams-details/${examId}`)
            .then(response => {
                const details = response.data[0];
                setExamDetails(details);
                setExamName(details.exam_name);
                // setPreCourse(details.course_code);
                setDuration(details.duration);
                setStartAt(new Date(details.start_at));
                setDueDate( details.due_date ? new Date(details.due_date) : new Date(new Date(details.start_at).getTime() + details.duration * 60 * 1000));
            })
            .catch(error => {
                console.error('Error fetching exam details:', error);
            })
            .finally(() => {
                setIsLoadingDetails(false);
            });
    }

    const fetchExamQuestions = async (examId) => {
        setIsLoadingQuestions(true);
        await axios.get(`/api/exams-questions/${examId}`)
            .then(response => {
                setExamQuestions(response.data);
            })
            .catch(error => {
                console.error('Error fetching exam questions:', error);
            })
            .finally(() => {
                setIsLoadingQuestions(false);
            });
    }

    const fetchExamAnswers = async (examId) => {
        setIsLoadingAnswers(true);
        await axios.get(`/api/exams-answers/${examId}`)
            .then(response => {
                setExamAnswers(response.data);
                console.log('answers:', response.data);
            })
            .catch(error => {
                console.error('Error fetching exam answers:', error);
            })
            .finally(() => {
                setIsLoadingAnswers(false);
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

    const totalScore = useMemo(() =>
            examQuestions.reduce((sum, question) => sum + (question.points || 0), 0),
        [examQuestions]
    );

    // const makeExamValidationData= (name, duration, startAt, dueDate, selectedCourse, questions) => {
    //     if (!name) {
    //         setExamNameErrMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
    //         return false;
    //     }
    //     if (duration <= 14) {
    //         setDurationErrMessage(language === 'En' ? 'Duration should be greater than 14' : 'يجب أن تكون المدة أكبر من 14');
    //         return false;
    //     }
    //     if (!startAt) {
    //         setStartAtErrMessage(language === 'En' ? 'Please select a date' : 'يرجى اختيار موعد');
    //         return false;
    //     }
    //     if (startAt < new Date()) {
    //         setStartAtErrMessage(language === 'En' ? "You can't select date in pass" : 'لا يمكنك إختيار موعد في الماضي');
    //         return false;
    //     }
    //     if (dueDate && !startAt) {
    //         setDueDateErrMessage({EnMessage: "Please select start date first", ArMessage: "الرجاء تحديد تاريخ البدء أولاً"});
    //         return false;
    //     }
    //     if (dueDate && startAt && dueDate < startAt) {
    //         setDueDateErrMessage({EnMessage: "Due date must be more recent than start date", ArMessage: "يجب ان يكون تاريخ الإنتهاء أحدث من تاريخ البدء"});
    //         return false;
    //     }
    //     if (dueDate && startAt) {
    //         const startAtUTC = moment(startAt);
    //         const dueDateUTC = moment(dueDate);
    //
    //         let differenceInMinutes = 0;
    //         if (dueDateUTC.isValid() && startAtUTC.isValid()) {
    //             differenceInMinutes = dueDateUTC.diff(startAtUTC, 'minutes');
    //         }
    //         if (duration > differenceInMinutes) {
    //             setDurationErrMessage(language === 'En'
    //                 ? 'Duration must be less than the difference between the two dates'
    //                 : 'يجب أن تكون المدة أصغر من الفرق بين التاريخين');
    //             return false;
    //         }
    //     }
    //     if (!selectedCourse) {
    //         setSelectedCourseErrMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
    //         return false;
    //     }
    //     if (questions.length <= 0) {
    //         setQuestionNotAddedErrMessage(language === 'En' ? 'Please add questions first.' : 'يرجى إضافة أسألة.');
    //         return false;
    //     }
    //
    //     return true;
    // }

    const handleEditSubmit = () => {

        // if (!makeExamValidationData(examName, duration, startAt, dueDate, totalScore, examQuestions)) return;

        const startAtUTC = moment(startAt).format();
        const dueDateUTC = dueDate ? moment(dueDate).format() : null;
        const updatedExam = {
            instructor_id: userId,
            exam_name: examName,
            new_course: newCourse,
            duration: duration,
            start_at: startAtUTC,
            due_date: dueDateUTC,
            total_score: totalScore,
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
                if (newCourse) {
                    setSelectedCourseId('');
                    setSelectedExamId('');
                }
            })
            .catch((error) => {
                console.error('Error updating exam:', error);
            });
    };


    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...examQuestions];
        updatedQuestions[index].question_text = parseInt(value) || 0;
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
        <>
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            {!editMode ? (
                <div className={"ExamPreviewPage_select-container"}>
                    <CourseSelect courses={courses} onSelect={handleCourseSelect} selectedCourse={selectedCourseId}/>
                    <ExamSelect exams={exams} onSelect={handleExamSelect} language={language} selectedExam={selectedExamId}/>
                </div>
            ) : null}
            {isLoadingDetails || isLoadingQuestions || isLoadingAnswers ? (
                <p>{language === 'En' ? 'Loading exam data...' : 'جاري تحميل بيانات الإمتحان...'}</p>
            ) : (
                <div className={"ExamPreviewPage_examContainer"}>
                    <div>
                        {editMode && exams.length > 0 ? (
                            <div>
                                <h2>Editing Exam</h2>
                                <div className="ExamPreviewPage_exam-container">
                                    <div className={"ExamPreviewPage_inputRow"}>
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

                                        <div className="ExamPreviewPage_input-wrapper">
                                            <label className="ExamPreviewPage_input-label">
                                                {language === 'En' ? `Selected Course:` : `المادة المختارة:`}
                                            </label>
                                            <select
                                                value={preCourse}
                                                onChange={(e) =>
                                                    setNewCourse(e.target.value)
                                                }
                                                className="ExamPreviewPage_select"
                                            >
                                                {courses.map((course) => (
                                                    <option key={course.course_code} value={course.course_code}>
                                                        {course.course_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

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
                                    </div>
                                    <div className="ExamPreviewPage_inputRow">
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
                                        <div className="ExamPreviewPage_input-wrapper">
                                            <label className="ExamPreviewPage_input-label" style={{display: 'block'}}>
                                                {language === 'En' ? 'Due Date (Optional):' : 'تاريخ الإنتهاء (إختياري):'}
                                            </label>
                                            <DatePicker
                                                selected={dueDate}
                                                onChange={(date) => setDueDate(date)}
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
                                                    <label className="ExamPreviewPage_input-question-label" style={{paddingTop: '20px'}}>
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
                                    <button onClick={handleEditSubmit} className="ExamPreviewPage_edit-button">
                                        {language === 'En' ? 'Submit Edit' : 'تأكيد التعديل'}
                                    </button>
                                    <button className={"ExamPreviewPage_delete-button"} onClick={toggleEditMode}>
                                        {language === 'En' ? 'Cancel Edit' : 'الغاء التعديل'}
                                    </button>
                                </div>
                            </div>
                        ) : null}
                        {selectedExamId && !editMode && (
                            <div className={"ExamPreviewPage_exam-container"}>
                                <div className="ExamPreviewPage_exam-details" style={{
                                    borderBottom: '2px solid gray',
                                    paddingBottom: '10px',
                                    marginBottom: '10px'
                                }}>
                                    <div className={"ExamPreviewPage_input-wrapper"}>
                                        <h3>{examDetails.exam_name}</h3>
                                    </div>
                                    <div className={"ExamPreviewPage_input-wrapper"}>
                                        <p>{language === 'En' ? 'Duration:' : 'المدة:'} {examDetails.duration} {language === 'En' ? 'minutes' : 'دقيقة'}</p>
                                    </div>
                                    <div className={"ExamPreviewPage_input-wrapper"}>
                                        <p>{`${language === 'En' ? 'Start Time: ' : 'موعد بدء الوقت: '} ${formatDate(examDetails.start_at)}`}</p>
                                    </div>
                                    {examDetails.due_date ? (
                                        <div className={"ExamPreviewPage_input-wrapper"}>
                                            <p>{`${language === 'En' ? 'Due Date: ' : 'موعد إنتهاء الإمتحان: '} ${formatDate(examDetails.due_date)}`}</p>
                                        </div>
                                    ) : null}
                                </div>
                                {examQuestions.map((question, questionIndex) => {
                                    const isMCQ = examAnswers.some(
                                        (answer) => answer.question_id === question.question_id
                                    );
                                    return (
                                        <div className="ExamPreviewPage_question-item" key={questionIndex} style={{marginBottom: '20px'}}>
                                            <h3>{questionIndex + 1}. {question.question_text} {language === 'En' ? '?' : '؟'}</h3>
                                            {isMCQ ? (
                                                examAnswers
                                                    .filter((answer) => answer.question_id === question.question_id)
                                                    .map((answer, answerIndex) => (
                                                        <div key={answerIndex}
                                                             style={{marginLeft: answer.is_correct === 1 ? '66px' : ''}}>
                                                            {language === 'En' ? 'Option' : 'إختيار'} {answerIndex + 1}: {answer.answer_text} {answer.is_correct === 1 ? (language === 'En' ? '{Correct}' : '{الإجابة الصحيحة}') : null}
                                                        </div>
                                                    ))
                                            ) : null}
                                            <p>{language === 'En' ? 'Points' : 'الدرجة'}({question.points})</p>
                                        </div>
                                    );
                                })}
                                {!isExamStarted && isExamEnded && (
                                    <>
                                        <button className={"ExamPreviewPage_edit-button"} onClick={toggleEditMode}>
                                            {language === 'En' ? 'Edit Exam' : 'تعديل الإمتحان'}
                                        </button>
                                    </>
                                )}
                                <button onClick={() => setDeletionVisible(true)}
                                        className="ExamPreviewPage_delete-button">
                                    {language === 'En' ? 'Delete Exam' : 'حذف الامتحان'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
            {deletionVisible && (
                <ConfirmDelete
                    deletionVisible={deletionVisible}
                    setDeletionVisible={setDeletionVisible}
                    handleDelete={() => handleDeleteExam()}
                />
            )}
        </>
    );
}

export default ExamPreviewPage;
