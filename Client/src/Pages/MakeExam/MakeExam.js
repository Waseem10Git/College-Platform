import React, {useState, useEffect, useContext} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './MakeExam.css';
import moment from 'moment';
import UserContext from "../../context/UserContext";
import coursesApi from "../../api/coursesApi";
import examApi from "../../api/examApi";
import instructorsCoursesExamsApi from "../../api/instructorsCoursesExamsApi";
import enrollmentsExamsApi from "../../api/enrollmentsExamsApi";
import questionsApi from "../../api/questionsApi";
import answersApi from "../../api/answersApi";
import notificationApi from "../../api/notificationApi";
import { toast } from 'react-toastify';

const MakeExam = () => {
  const { language, isDarkMode, userId, role } = useContext(UserContext);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [examName, setExamName] = useState('');
  const [duration, setDuration] = useState(15);
  const [points, setPoints] = useState(1);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [startAt, setStartAt] = useState(new Date());
  const [dueDate, setDueDate] = useState(null);
  const [examNameErrMessage, setExamNameErrMessage] = useState('');
  const [durationErrMessage, setDurationErrMessage] = useState('');
  const [startAtErrMessage, setStartAtErrMessage] = useState('');
  const [dueDateErrMessage, setDueDateErrMessage] = useState({EnMessage: '', ArMessage: ''});
  const [selectedCourseErrMessage, setSelectedCourseErrMessage] = useState('');
  const [questionTypeErrMessage, setQuestionTypeErrMessage] = useState('');
  const [questionErrMessage, setQuestionErrMessage] = useState('');
  const [optionsErrMessage, setOptionsErrMessage] = useState('');
  const [correctAnswerErrMessage, setCorrectAnswerErrMessage] = useState('');
  const [questionNotAddedErrMessage, setQuestionNotAddedErrMessage] = useState('');
  const [pointErrMessage, setPointErrMessage] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("makeExamData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setQuestions(parsedData.questions || []);
      setNewQuestion(parsedData.newQuestion || '');
      setQuestionType(parsedData.questionType || 'MCQ');
      setOptions(parsedData.options || []);
      setCorrectAnswer(parsedData.correctAnswer || '');
      setExamName(parsedData.examName || '');
      setDuration(parsedData.duration || 15);
      setPoints(parsedData.points || 1);
      setSelectedCourse(parsedData.selectedCourse || '');
      // setStartAt(parsedData.startAt ? new Date(parsedData.startAt) : new Date());
    }
  }, []);

  useEffect(() => {
    // Save current state to localStorage whenever it changes
    const makeExamData = {
      questions,
      newQuestion,
      questionType,
      options,
      correctAnswer,
      examName,
      duration,
      points,
      selectedCourse,
      startAt,
    };
    localStorage.setItem("makeExamData", JSON.stringify(makeExamData));
  }, [questions, newQuestion, questionType, options, correctAnswer, examName, duration, points, selectedCourse, startAt]);

  const fetchCourses = async () => {
    try {
      const response = await coursesApi.fetchSomeCourses(role, userId);

      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        console.error('Expected array but got:', response.data);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [userId, role]);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

  const handleAddOption = () => {
    const newOptionLabel = alphabet[options.length];
    const newOption = { label: newOptionLabel, value: '' };
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].value = value;
    setOptions(newOptions);
  };

  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleQuestionSubmit = async () => {
    resetAllErrMessages();

    if (!addQuestionValidationData(newQuestion, questionType, options, correctAnswer, points)) return;

    let correctAnswerIndex = '';
    if (questionType === 'MCQ' && correctAnswer !== '') {
      correctAnswerIndex = options.findIndex(option => option.label === correctAnswer);
    }
    if (correctAnswerIndex === '' && options.length > 0) {
      correctAnswerIndex = 0; // Set to the index of the first option
    }
    const newQuestionObject = {
      question: newQuestion,
      type: questionType,
      options: questionType === 'MCQ' ? options.map(option => option.value) : [],
      correctAnswer: correctAnswerIndex !== -1 ? correctAnswerIndex : 'Not Set',
      points: points,
    };
    setQuestions([...questions, newQuestionObject]);
    setTotalPoints(prevTotal => prevTotal + points);
    setNewQuestion('');
    setOptions([]);
    setCorrectAnswer('');
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const resetAllData = () => {
    setNewQuestion('');
    setQuestionType('MCQ');
    setCorrectAnswer('');
    setExamName('');
    setDuration(15);
    setSelectedCourse('');
    setStartAt(new Date());
    setDueDate(null);
    setQuestions([]);
    setPoints(1);
    setTotalPoints(0);

    // Clear localStorage when resetting
    localStorage.removeItem("makeExamData");
  };

  const resetAllErrMessages = () => {
    setExamNameErrMessage('');
    setDurationErrMessage('');
    setStartAtErrMessage('');
    setDueDateErrMessage({EnMessage: '', ArMessage: ''});
    setSelectedCourseErrMessage('');
    setQuestionErrMessage('');
    setQuestionTypeErrMessage('');
    setQuestionNotAddedErrMessage('');
    setCorrectAnswerErrMessage('');
    setPointErrMessage('');
    setOptionsErrMessage('')
  }

  const makeExamValidationData= (name, duration, startAt, dueDate, selectedCourse, questions) => {
    if (!name) {
      setExamNameErrMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
      return false;
    }
    if (duration <= 14) {
      setDurationErrMessage(language === 'En' ? 'Duration should be greater than 14' : 'يجب أن تكون المدة أكبر من 14');
      return false;
    }
    if (!startAt) {
      setStartAtErrMessage(language === 'En' ? 'Please select a date' : 'يرجى اختيار موعد');
      return false;
    }
    if (startAt < new Date()) {
      setStartAtErrMessage(language === 'En' ? "You can't select date in pass" : 'لا يمكنك إختيار موعد في الماضي');
      return false;
    }
    if (dueDate && !startAt) {
      setDueDateErrMessage({EnMessage: "Please select start date first", ArMessage: "الرجاء تحديد تاريخ البدء أولاً"});
      return false;
    }
    if (dueDate && startAt && dueDate < startAt) {
      setDueDateErrMessage({EnMessage: "Due date must be more recent than start date", ArMessage: "يجب ان يكون تاريخ الإنتهاء أحدث من تاريخ البدء"});
      return false;
    }
    if (dueDate && startAt) {
      const startAtUTC = moment(startAt);
      const dueDateUTC = moment(dueDate);

      let differenceInMinutes = 0;
      if (dueDateUTC.isValid() && startAtUTC.isValid()) {
        differenceInMinutes = dueDateUTC.diff(startAtUTC, 'minutes');
      }
      if (duration > differenceInMinutes) {
        setDurationErrMessage(language === 'En'
            ? 'Duration must be less than the difference between the two dates'
            : 'يجب أن تكون المدة أصغر من الفرق بين التاريخين');
        return false;
      }
    }
    if (!selectedCourse) {
      setSelectedCourseErrMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
      return false;
    }
    if (questions.length <= 0) {
      setQuestionNotAddedErrMessage(language === 'En' ? 'Please add questions first.' : 'يرجى إضافة أسألة.');
      return false;
    }

    return true;
  }

  const addQuestionValidationData = (question, questionType, options, correctAnswer, point) => {
    if (!question) {
      setQuestionErrMessage(language === 'En' ? 'Please fill out this field' : 'يرجى ملء هذا الحقل');
      return false;
    }
    if (!questionType) {
      setQuestionTypeErrMessage(language === 'En' ? 'Please select an item in each list.' : 'يرجى اختيار عنصر في كل قائمة.');
      return false;
    }
    if (questionType === 'MCQ' && options.length <= 0) {
      setOptionsErrMessage(language === 'En' ? 'Please add options for multiple choice question type.' : 'يرجى إضافة خيارات لنوع سؤال الاختيار المتعدد.');
      return false;
    }
    if (questionType === 'MCQ' && options.some(option => option.value.trim() === '')) {
      setOptionsErrMessage(language === 'En' ? 'Please ensure all options are filled out' : 'يرجى التأكد من ملء جميع الخيارات');
      return false;
    }
    if (questionType === 'MCQ' && correctAnswer === '' && options.length > 0) {
      setCorrectAnswerErrMessage(language === 'En' ? 'Please select a correct answer' : 'يرجى اختيار الإجابة الصحيحة');
      return false;
    }
    if (point <= 0) {
      setPointErrMessage(language === 'En' ? 'Points should be greater than 0' : 'يجب أن تكون النقاط أكبر من 0');
      return false;
    }

    return true;
  }

  const handleExamSubmit = async (event) => {
    event.preventDefault();

    resetAllErrMessages();

    try {
      if (!makeExamValidationData(examName, duration, startAt, dueDate, selectedCourse, questions)) return;

      const startAtUTC = moment(startAt).format();
      const dueDateUTC = dueDate ? moment(dueDate).format() : null;

      const response = await examApi.createExam(examName, duration, startAtUTC, dueDateUTC, totalPoints, selectedCourse, userId);
      const exam_id = response.data.exam_id;

      // Associate exam with instructor's course
      await instructorsCoursesExamsApi.assignExamToCourse(selectedCourse, userId, exam_id);
      // Associate exam with students enrollment in course
      await enrollmentsExamsApi.assignExamToStudent(selectedCourse, userId, exam_id);

      // Save each question and its options to the database
      for (let question of questions) {
        const questionResponse = await questionsApi.addQuestionsToExam(exam_id, question.question, question.type, question.points);
        const question_id = questionResponse.data.question_id;

        if (question.type === 'MCQ') {
          for (let i = 0; i < question.options.length; i++) {
            await answersApi.addAnswersToQuestions(question_id, question, i);
          }
        }
      }

      const EnNotificationMessage = `New Exam Added for course `;
      const ArNotificationMessage = `تم رفع إمتحان جديد للمادة `;
      await notificationApi.sendNotification(userId, selectedCourse, EnNotificationMessage, ArNotificationMessage);

      toast.success(language === 'En' ? 'Exam Added Success' : 'تم إضافة الاختبار بنجاح');
      resetAllData();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(language === 'En' ? 'Error saving exam please try again later.' : 'حدث خطأ أثناء حفظ الاختبار، يرجى المحاولة مرة أخرى لاحقًا.');
      }
    }
  };

  return (
      <div className={`MakeExam ${isDarkMode ? 'MakeExam_dark' : 'MakeExam_light'}`}>
        <div className="MakeExam_examContainer">
          <h1 className="MakeExam_examHeading">{language === 'En' ? 'Exam Creation' : 'إنشاء الامتحان'}</h1>

          <div>
            <div className="MakeExam_inputRow">
              <div className="MakeExam_inputWrapper">
                {examNameErrMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{examNameErrMessage}</p>
                )}
                <label className="MakeExam_inputLabel">
                  {language === 'En' ? 'Exam Name:' : 'اسم الامتحان:'}
                </label>
                <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="MakeExam_inputField"
                />
              </div>
              <div className="MakeExam_inputWrapper">
                {selectedCourseErrMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{selectedCourseErrMessage}</p>
                )}
                <label className="MakeExam_inputLabel">
                  {language === 'En' ? 'Select Course:' : 'اختر المادة:'}
                </label>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="MakeExam_inputField"
                >
                  <option value="">
                    {language === 'En' ? 'Select a course' : 'اختر مادة:'}
                  </option>
                  {courses.map((course) => (
                      <option key={course.course_code} value={course.course_code}>
                        {course.course_name}
                      </option>
                  ))}
                </select>
              </div>
              <div className="MakeExam_inputWrapper">
                {durationErrMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{durationErrMessage}</p>
                )}
                <label className="MakeExam_inputLabel">
                  {language === 'En' ? 'Duration:' : 'مدة الامتحان:'}
                </label>
                <div className={'MakeExam_input-container'}>
                  <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="MakeExam_inputField"
                      min={15}
                      placeholder={'15-180'}
                  />
                  <span className="MakeExam_unit-label" style={language === 'En' ? {right: '10px'} : {left: '10px'}}>min</span>
                </div>
              </div>
            </div>

            {/* Second row: Start At and Select Course */}
            <div className="MakeExam_inputRow">
              <div className="MakeExam_inputWrapper">
                {startAtErrMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{startAtErrMessage}</p>
                )}
                <label className="MakeExam_inputLabel">
                  {language === 'En' ? 'Start At:' : 'تاريخ البدء:'}
                </label>
                <DatePicker
                    selected={startAt}
                    onChange={(date) => setStartAt(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="MakeExam_inputField MakeExam_customDatePickerWidth"
                    minDate={new Date()}
                    minTime={
                      startAt && startAt.toDateString() === new Date().toDateString()
                          ? new Date()
                          : new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                    required
                />
              </div>
              <div className="MakeExam_inputWrapper">
                {dueDateErrMessage.EnMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{language === 'En' ? dueDateErrMessage.EnMessage : dueDateErrMessage.ArMessage}</p>
                )}
                <label className="MakeExam_inputLabel">
                  {language === 'En' ? 'Due Date (Optional):' : 'تاريخ الإنتهاء (إختياري):'}
                </label>
                <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="MakeExam_inputField MakeExam_customDatePickerWidth"
                    minDate={startAt}
                    minTime={
                      dueDate && dueDate.toDateString() === new Date().toDateString()
                          ? new Date()
                          : new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                    required
                />
              </div>

            </div>
          </div>

          <hr className="MakeExam_horizontalLine"/>

          <div className="MakeExam_inputWrapper">
            {questionErrMessage && (
                <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{questionErrMessage}</p>
            )}
            <label className="MakeExam_inputLabel">{language === 'En' ? 'Question:' : 'السؤال:'}</label>
            <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="MakeExam_inputField"
            />
          </div>
          <div className="MakeExam_selectWrapper">
            {questionTypeErrMessage && (
                <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{questionTypeErrMessage}</p>
            )}
            <label className="MakeExam_selectLabel">{language === 'En' ? 'Question Type:' : 'نوع السؤال:'}</label>
            <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="MakeExam_selectField"
            >
              <option value="MCQ">{language === 'En' ? 'MCQ' : 'إختر من المتعدد'}</option>
              <option value="Essay">{language === 'En' ? 'Essay' : 'مقالي'}</option>
            </select>
          </div>
          {questionType === 'MCQ' && (
              <div className="MakeExam_optionsSection">
                {optionsErrMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{optionsErrMessage}</p>
                )}
                {options.map((option, index) => (
                    <div key={index} className="MakeExam_optionItem">
                      <label className="MakeExam_optionLabel">{alphabet[index]}</label>
                      <input
                          type="text"
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="MakeExam_optionInput"
                      />
                      <button onClick={() => handleDeleteOption(index)} className="MakeExam_deleteButton">X</button>
                    </div>
                ))}
                <button onClick={handleAddOption} className="MakeExam_addOptionButton">
                  {language === 'En' ? 'Add option' : 'أضف إختيار'}
                </button>
              </div>
          )}
          {questionType === 'MCQ' && (
              <div className="MakeExam_correctAnswerSection">
                {correctAnswerErrMessage && (
                    <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{correctAnswerErrMessage}</p>
                )}
                <label className="MakeExam_correctAnswerLabel">
                  {language === 'En' ? 'Correct Answer:' : 'الإجابة الصحيحة:'}
                </label>
                <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="MakeExam_correctAnswerSelect"
                >
                  <option value="" disabled>{language === 'En' ? '-- Select Answer --' : '-- اختر إجابة --'}</option>
                  {options.map((_, index) => (
                      <option key={index} value={alphabet[index]}>
                        {alphabet[index]}
                      </option>
                  ))}
                </select>
              </div>
          )}
          <div className="MakeExam_inputWrapper">
            {pointErrMessage && (
                <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{pointErrMessage}</p>
            )}
            <label className="MakeExam_inputLabel">{language === 'En' ? 'Points:' : 'النقاط:'}</label>
            <input
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value))}
                className="MakeExam_inputField"
                min={1}
            />
          </div>
          <button onClick={handleQuestionSubmit} className="MakeExam_addQuestionButton">
            {language === 'En' ? 'Add Question' : 'أضف سؤال'}
          </button>
          {questionNotAddedErrMessage && (
              <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{questionNotAddedErrMessage}</p>
          )}
          <h2 className="MakeExam_addedQuestionsHeading">{language === 'En' ? 'Questions added:' : 'الأسئلة المضافة:'}</h2>
          <ul className="MakeExam_addedQuestionsList">
            {questions.map((question, index) => (
                <li key={index} className="MakeExam_questionItem">
                  <div className="content">
                    <div className="MakeExam_question">
                      <strong>{index + 1}:</strong> {question.question}
                    </div>
                    {question.type === 'MCQ' && (
                        <div>
                          <strong
                              className="MakeExam_optionsHeading">{language === 'En' ? 'Options:' : 'إختيار:'}</strong>
                          <ul className="MakeExam_optionsList">
                            {question.options.map((option, optionIndex) => (
                                <li key={optionIndex} className="MakeExam_optionItem">
                                  {alphabet[optionIndex]}: {option}
                                </li>
                            ))}
                          </ul>
                          <strong
                              className="MakeExam_correctAnswerHeading">{language === 'En' ? 'Correct Answer: ' : 'الإجابة الصحيحة: '}</strong>
                          {question.correctAnswer !== '' ? alphabet[question.correctAnswer] : 'Not Set'}
                        </div>
                    )}
                    <strong
                        className="MakeExam_questionPoint">{language === 'En' ? 'Point:' : 'الدرجة:'}</strong> {question.points}
                    {index !== questions.length - 1 && <hr className="MakeExam_horizontalLine"/>}
                  </div>
                  <button onClick={() => handleDeleteQuestion(index)} className="MakeExam_deleteQuestionButton">X
                  </button>
                </li>
            ))}
          </ul>
          <button onClick={handleExamSubmit} className="MakeExam_submitExamButton">
            {language === 'En' ? 'Submit Exam' : 'تأكيد إنشاء الإمتحان'}
          </button>
        </div>
      </div>
  );
};

export default MakeExam;
