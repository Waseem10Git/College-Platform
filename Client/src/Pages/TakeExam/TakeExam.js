import { useEffect, useState } from 'react';
import './TakeExam.css';
import axios from 'axios';
import CourseSelect from '../ExamResults/CourseSelect';
import ExamSelect from '../ExamResults/ExamSelect';
import {NotificationModal} from '../../components'; // Ensure this is the correct path to your NotificationModal component

const TakeExam = ({ isDarkMode, language, Role, userId }) => {
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [examDetails, setExamDetails] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examAnswers, setExamAnswers] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const [isInExam, setIsInExam] = useState(false);
  const [timer, setTimer] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, message: '' }); // State for managing notifications

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/student/${userId}/courses`);
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error('Expected array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId, Role]);

  useEffect(() => {
    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, [intervalId]);

  const handleCourseSelect = (courseId) => {
    console.log('courseId', courseId);
    axios
        .get(`http://localhost:4001/api/exams/${courseId}`)
        .then((response) => {
          setExams(response.data);
        })
        .catch((error) => {
          console.error('Error fetching exams:', error);
        });
    resetExamState();
  };

  const handleExamDetailsSelect = (examId) => {
    console.log('examId: ', examId);
    resetExamState();
    setSelectedQuizId(examId);
    axios
        .get(`http://localhost:4001/api/exams-details/${examId}`)
        .then((response) => {
          const details = response.data[0];
          setExamDetails(details);

          const startTime = new Date(formatDate(details.start_at));
          const durationInMilliseconds = details.duration * 60 * 1000;
          const endTime = new Date(startTime.getTime() + durationInMilliseconds);
          const currentTime = new Date();

          if (currentTime >= endTime) {
            setIsExamEnded(true);
          } else if (currentTime >= startTime && currentTime < endTime) {
            setIsExamStarted(true);
            startExamCountdown(startTime, durationInMilliseconds, currentTime);
          }
        })
        .catch((error) => {
          console.error('Error fetching exam details:', error);
        });

    axios
        .get(`http://localhost:4001/api/exams-questions/${examId}`)
        .then((response) => {
          setExamQuestions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching exam questions:', error);
        });

    axios
        .get(`http://localhost:4001/api/exams-answers/${examId}`)
        .then((response) => {
          setExamAnswers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching exam questions:', error);
        });
  };

  const handleAnswerSelect = (questionId, answer) => {
    setStudentAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    examQuestions.forEach((question) => {
      const correctAnswers = examAnswers
          .filter((answer) => answer.question_id === question.question_id && answer.is_correct === 1)
          .map((answer) => answer.answer_text);

      if (correctAnswers.includes(studentAnswers[question.question_id])) {
        correctCount += question.points;
      }
    });
    return correctCount;
  };

  const handleSubmit = () => {
    const answers = examQuestions.map((question) => {
      const answerText = studentAnswers[question.question_id] || '';
      const isCorrect = examAnswers.some(
          (answer) =>
              answer.question_id === question.question_id &&
              answer.answer_text === answerText &&
              answer.is_correct === 1
      );
      return {
        questionId: question.question_id,
        answerText,
        isCorrect,
      };
    });

    axios
        .post(`http://localhost:4001/api/student-answers/${userId}`, {
          answers,
          examId: selectedQuizId,
        })
        .then((response) => {
          setIsSubmitted(true);
          setIsExamEnded(true);
          clearInterval(intervalId); // Clear interval on submit
          setShowResults(true); // Show results after submitting
        })
        .catch((error) => {
          console.error('Error submitting exam:', error);
        });
  };

  const handleStartExam = () => {
    axios
        .get(`http://localhost:4001/api/student-exam-status/${userId}/${selectedQuizId}`)
        .then((response) => {
          if (response.data.is_submitted) {
            // setIsSubmitted(true);
            setNotification({ isOpen: true, message: 'You have already submitted this exam.' }); // Replace alert
          } else {
            setIsInExam(true);
            const startTime = new Date(formatDate(examDetails.start_at));
            const currentTime = new Date();

            if (currentTime >= startTime) {
              setIsExamStarted(true);
              const durationInSeconds = examDetails.duration * 60;
              startExamCountdown(startTime, durationInSeconds * 1000, currentTime);
            } else {
              setNotification({ isOpen: true, message: 'Exam has not started yet. Please wait until the start time.' }); // Replace alert
            }
          }
        })
        .catch((error) => {
          console.error('Error checking exam status:', error);
        });
  };

  const startExamCountdown = (startTime, durationInMilliseconds, currentTime) => {
    clearInterval(intervalId);
    const remainingTime = Math.max(
        (startTime.getTime() + durationInMilliseconds - currentTime.getTime()) / 1000,
        0
    );
    setTimer(Math.floor(remainingTime));

    const newIntervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(newIntervalId);
          handleSubmit();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setIntervalId(newIntervalId);
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

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const resetExamState = () => {
    setIsExamStarted(false);
    setIsExamEnded(false);
    setStudentAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setIsInExam(false);
    setSelectedQuizId('');
  };

  return (
      <div className={`quiz-result ${isDarkMode ? 'dark' : 'light'}`}>
        {!isInExam && !showResults && (
            <div className="select-container">
              <CourseSelect language={language} courses={courses} onSelect={handleCourseSelect} />
              <ExamSelect language={language} exams={exams} onSelect={handleExamDetailsSelect} />
            </div>
        )}

        {selectedQuizId && !isInExam && !showResults && (
            <div className="exam-details">
              <h3>{examDetails.exam_name}</h3>
              {!isExamEnded ? <h3>Duration: {examDetails.duration} minutes</h3> : null}
              <p>
                {isExamEnded
                    ? 'Exam End'
                    : isExamStarted
                        ? 'Exam Started'
                        : `Start Time: ${formatDate(examDetails.start_at)}`}
              </p>
              {isExamStarted && !isExamEnded && (
                  <div>
                    <p>Time Remaining: {formatTime(timer)}</p>
                    <button onClick={handleStartExam} disabled={isSubmitted}>
                      Start Exam
                    </button>
                  </div>
              )}
              {isExamEnded && (
                  <button onClick={() => setShowResults(true)}>Show Exam Result</button>
              )}
            </div>
        )}

        {isInExam && !showResults && (
            <div className="questions-container">
              <div className="timer">{formatTime(timer)}</div>
              {examQuestions.length > 0 && (
                  <div>
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
                                        <button
                                            key={answerIndex}
                                            className={`answer-button ${
                                                studentAnswers[question.question_id] === answer.answer_text
                                                    ? 'selected'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                handleAnswerSelect(question.question_id, answer.answer_text)
                                            }
                                            disabled={isSubmitted}
                                        >
                                          {answer.answer_text}
                                        </button>
                                    ))
                            ) : (
                                <input
                                    type="text"
                                    id="essayAnswer"
                                    value={studentAnswers[question.question_id] || ''}
                                    onChange={(e) => handleAnswerSelect(question.question_id, e.target.value)}
                                    required
                                    disabled={isSubmitted}
                                />
                            )}
                          </div>
                      );
                    })}
                    <div className="navigation-buttons">
                      <button onClick={handleSubmit} disabled={isSubmitted}>
                        Submit
                      </button>
                    </div>
                  </div>
              )}
            </div>
        )}

        {showResults && (
            <div className="results-container">
              <h2>Exam Result</h2>
              <table>
                <thead>
                <tr>
                  <th>Question</th>
                  <th>Correct Answer</th>
                  <th>Your Answer</th>
                  <th>Question Score</th>
                </tr>
                </thead>
                <tbody>
                {examQuestions.map((question, index) => (
                    <tr key={index}>
                      <td>{question.question_text}</td>
                      <td>
                        {examAnswers.filter(
                            (answer) => answer.question_id === question.question_id && answer.is_correct === 1
                        ).length > 0
                            ? examAnswers
                                .filter(
                                    (answer) => answer.question_id === question.question_id && answer.is_correct === 1
                                )
                                .map((answer, answerIndex) => (
                                    <p key={answerIndex}>{answer.answer_text}</p>
                                ))
                            : '(Essay)'}
                      </td>

                      <td>{studentAnswers[question.question_id]}</td>
                      <td>{question.points}</td>
                    </tr>
                ))}
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    Your score
                  </td>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    {calculateScore()}
                  </td>
                </tr>
                </tbody>
              </table>
              <button
                  onClick={() => {
                    resetExamState();
                    setExams([]);
                  }}
              >
                Back
              </button>
            </div>
        )}

        {notification.isOpen && (
            <NotificationModal
                message={notification.message}
                onClose={() => setNotification({ isOpen: false, message: '' })}
            />
        )}
      </div>
  );
};

export default TakeExam;
