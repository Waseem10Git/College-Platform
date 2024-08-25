import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './MakeExam.css';
import axios from '../../api/axios';
import moment from 'moment';

const MakeExam = ({ language, isDarkMode, userId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [examName, setExamName] = useState('');
  const [duration, setDuration] = useState(0);
  const [points, setPoints] = useState(1);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [startAt, setStartAt] = useState(null);

  useEffect(() => {
    axios.get(`/api/courses/${userId}`)
        .then(response => {
          setCourses(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching courses:', error);
        });
  }, []);

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
    setDuration(0);
    setSelectedCourse('');
    setStartAt(null);
    setQuestions([]);
    setPoints(1);
  };

  const handleExamSubmit = async (event) => {
    event.preventDefault();

    const startAtUTC = moment(startAt).format();

    // Save the exam to the database
    try {
      const response = await axios.post('/api/exams', {
        exam_name: examName,
        duration: duration,
        start_at: startAtUTC,
        selectedCourse: selectedCourse,
        userId: userId
      });
      const exam_id = response.data.exam_id;

      // Associate exam with instructor's course
      await axios.post('/api/instructorsCoursesExams', {
        course_code: selectedCourse,
        instructor_id: userId,
        exam_id: exam_id
      });

      await axios.post('/api/enrollmentsExams', {
        course_code: selectedCourse,
        instructor_id: userId,
        exam_id: exam_id
      });

      // Save each question and its options to the database
      for (let question of questions) {
        const questionResponse = await axios.post('/api/questions', {
          exam_id,
          question_text: question.question,
          points: points,
        });
        const question_id = questionResponse.data.question_id;

        if (question.type === 'MCQ') {
          for (let i = 0; i < question.options.length; i++) {
            await axios.post('/api/answers', {
              question_id,
              answer_text: question.options[i],
              is_correct: i === question.correctAnswer,
            });
          }
        }
      }

      alert('Exam Added: Success');
      resetAllData();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  return (
      <div className={`exam-page ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="exam-container">
          <h1 className="exam-heading">{language === 'En' ? 'Exam Creation' : 'إنشاء الامتحان'}</h1>
          <div className="input-wrapper">
            <label className="input-label">{language === 'En' ? 'Exam Name:' : 'اسم الامتحان'}</label>
            <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="input-field"
            />
          </div>
          <div className="input-wrapper">
            <label className="input-label">{language === 'En' ? 'Duration:' : 'مدة الامتحان'}</label>
            <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="input-field"
            />
          </div>
          <div className="input-wrapper">
            <label className="input-label">{language === 'En' ? 'Start At:' : 'تاريخ البدء'}</label>
            <DatePicker
                selected={startAt}
                onChange={(date) => setStartAt(date)}
                showTimeSelect
                dateFormat="Pp"
                className="input-field"
                minDate={new Date()}
                minTime={
                  startAt && startAt.toDateString() === new Date().toDateString()
                      ? new Date()  // If today, set minTime to now
                      : new Date(new Date().setHours(0, 0, 0, 0))
                }
                maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                required
            />
          </div>
          <div className="input-wrapper">
            <label className="input-label">{language === 'En' ? 'Select Course:' : 'اختر الدورة'}</label>
            <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="select-field"
            >
              <option value="">{language === 'En' ? 'Select a course' : 'اختر دورة'}</option>
              {courses.map(course => (
                  <option key={course.course_code} value={course.course_code}>
                    {course.course_name}
                  </option>
              ))}
            </select>
          </div>
          <hr className="horizontal-line" />
          <div className="input-wrapper">
            <label className="input-label">{language === 'En' ? 'Question:' : 'السؤال'}</label>
            <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="input-field"
            />
          </div>
          <div className="select-wrapper">
            <label className="select-label">{language === 'En' ? 'Question Type:' : 'نوع السؤال'}:</label>
            <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="select-field"
            >
              <option value="MCQ">{language === 'En' ? 'MCQ' : 'إختر من المتعدد'}</option>
              <option value="Essay">{language === 'En' ? 'Essay' : 'مقالي'}</option>
            </select>
          </div>
          {questionType === 'MCQ' && (
              <div className="options-section">
                {options.map((option, index) => (
                    <div key={index} className="option-item">
                      <label className="option-label">{alphabet[index]}</label>
                      <input
                          type="text"
                          value={option.value}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="option-input"
                      />
                      <button onClick={() => handleDeleteOption(index)} className="delete-button">X</button>
                    </div>
                ))}
                <button onClick={handleAddOption}
                        className="add-option-button">{language === 'En' ? 'Add option' : 'أضف إخيار'}</button>
              </div>
          )}
          {questionType === 'MCQ' && (
              <div className="correct-answer-section">
                <label
                    className="correct-answer-label">{language === 'En' ? 'Correct Answer:' : 'الإجابة الصحيحة'}</label>
                <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="correct-answer-select"
                >
                  {options.map((_, index) => (
                      <option key={index} value={alphabet[index]}>{alphabet[index]}</option>
                  ))}
                </select>
              </div>
          )}
          <div className="input-wrapper">
            <label className="input-label">{language === 'En' ? 'Point:' : 'الدرجة:'}</label>
            <input
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value))}
                className="input-field"
            />
          </div>
          <button onClick={handleQuestionSubmit}
                  className="add-question-button">{language === 'En' ? 'Add Question' : 'أضف سؤال'}</button>
          <h2 className="added-questions-heading">{language === 'En' ? 'Questions added:' : ':الاساله المضافه'}</h2>
          <ul className="added-questions-list">
            {questions.map((question, index) => (
                <li key={index} className="question-item">
                  <div className='content'>
                    <div className='question'>
                      <strong> {index + 1}:</strong> {question.question}
                    </div>
                    {question.type === 'MCQ' && (
                        <div>
                          <strong className="options-heading">{language === 'En' ? 'Options:' : ':إختيار'}</strong>
                          <ul className="options-list">
                            {question.options.map((option, optionIndex) => (
                                <li key={optionIndex} className="option-item">{alphabet[optionIndex]}: {option}</li>
                            ))}
                          </ul>
                          <strong
                              className="correct-answer-heading">{language === 'En' ? 'Correct Answer:' : 'الإجابة الصحيحة'}
                          </strong> {question.correctAnswer !== '' ? alphabet[question.correctAnswer] : 'Not Set'}
                        </div>
                    )}
                    <strong
                        className={"question-point"}>{language === 'En' ? 'Point:' : 'الدرجة:'}</strong> {question.points}
                    {index !== questions.length - 1 && <hr className="horizontal-line" />}
                  </div>
                  <button onClick={() => handleDeleteQuestion(index)} className="delete-question-button">X</button>
                </li>
            ))}
          </ul>
          <button onClick={handleExamSubmit}
                  className="submit-exam-button">{language === 'En' ? 'Submit Exam' : 'أرسل الامتحان'}</button>
        </div>
      </div>
  );
};

export default MakeExam;
