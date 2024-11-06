import React, {useContext, useState} from 'react';
import './ExamResultDetails.css';
import quizData from './quizData ';
import UserContext from "../../context/UserContext";

const ExamResultDetails = () => {
  const { isDarkMode } = useContext(UserContext);
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
      <div className={`examResultDetails_quizResult ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="examResultDetails_selectContainer">
          <h2 className="examResultDetails_h2">Select Course</h2>
          <select
              className="examResultDetails_select"
              onChange={(e) => handleCourseSelect(e.target.value)}
          >
            <option value="">-- Select Course --</option>
            {quizData.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
            ))}
          </select>

          <h2 className="examResultDetails_h2">Select Quiz</h2>
          <select
              className="examResultDetails_select"
              onChange={(e) => handleQuizSelect(e.target.value)}
              disabled={!selectedCourseId}
          >
            <option value="">-- Select Quiz --</option>
            {selectedCourseId &&
                quizData
                    .find((course) => course.courseId === selectedCourseId)
                    ?.quizzes.map((quiz) => (
                    <option key={quiz.quizId} value={quiz.quizId}>
                      {quiz.quizName}
                    </option>
                ))}
          </select>
        </div>

        <div className="examResultDetails_resultsTable">
          {quizQuestions.length > 0 && (
              <table className="examResultDetails_table">
                <thead>
                <tr>
                  <th className="examResultDetails_th">Question</th>
                  <th className="examResultDetails_th">Correct Answer</th>
                  <th className="examResultDetails_th">Your Answer</th>
                </tr>
                </thead>
                <tbody>
                {quizQuestions.map((question) => (
                    <tr key={question.questionId} className="examResultDetails_tr">
                      <td className="examResultDetails_td">{question.questionText}</td>
                      <td className="examResultDetails_td">{question.correctAnswer}</td>
                      <td className="examResultDetails_td">{question.studentAnswer}</td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>

        {quizQuestions.length > 0 && (
            <div className="examResultDetails_score">
              <p className="examResultDetails_p">Student Score: {studentScore}</p>
              <p className="examResultDetails_p">Total Score: {totalScore}</p>
            </div>
        )}
      </div>
  );
};

export default ExamResultDetails;
