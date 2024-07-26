import React, { useState} from 'react';
import './ExamResultDetails.css';
import quizData from './quizData ';
import {TableExamResult} from "../../components";

const ExamResultDetails = ({ isDarkMode }) => {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedQuizId('');
    setQuizQuestions([]);
  };

  const handleQuizSelect = (quizId) => {
    setSelectedQuizId(quizId);
    const course = quizData.find(course => course.courseId === selectedCourseId);
    const quiz = course?.quizzes.find(quiz => quiz.quizId === quizId);
    setQuizQuestions(quiz ? quiz.questions : []);
  };

  
  const calculateScore = (questions) => {
    let correctCount = 0;
    questions.forEach(question => {
      if (question.studentAnswer === question.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };
  
  const totalScore = quizQuestions.length;
  const studentScore = calculateScore(quizQuestions);

  return (
    <div className={`quiz-result ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="select-container">
        <h2>Select Course</h2>
        <select onChange={(e) => handleCourseSelect(e.target.value)}>
          <option value="">-- Select Course --</option>
          {quizData.map(course => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>

        <h2>Select Quiz</h2>
        <select onChange={(e) => handleQuizSelect(e.target.value)} disabled={!selectedCourseId}>
          <option value="">-- Select Quiz --</option>
          {selectedCourseId && quizData
            .find(course => course.courseId === selectedCourseId)
            ?.quizzes.map(quiz => (
              <option key={quiz.quizId} value={quiz.quizId}>
                {quiz.quizName}
              </option>
            ))}
        </select>
      </div>

      <div className="results-table">
        {quizQuestions.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Correct Answer</th>
                <th>Your Answer</th>
              </tr>
            </thead>
            <tbody>
              {quizQuestions.map(question => (
                <tr key={question.questionId}>
                  <td>{question.questionText}</td>
                  <td>{question.correctAnswer}</td>
                  <td>{question.studentAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {quizQuestions.length > 0 && (
        <div className="score">
          <p>Student Score: {studentScore}</p>
          <p>Total Score: {totalScore}</p>
        </div>
      )}
    </div>
  );
};

export default ExamResultDetails;
