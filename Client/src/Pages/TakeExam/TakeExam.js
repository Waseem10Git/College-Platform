import {useContext, useEffect, useState} from 'react';
import './TakeExam.css';
import axios from '../../api/axios';
import CourseSelect from '../ExamResults/CourseSelect';
import ExamSelect from '../ExamResults/ExamSelect';
import {NotificationModal} from '../../components';
import UserContext from "../../context/UserContext";
import examApi from "../../api/examApi";

const TakeExam = () => {
  const { isDarkMode, language, role, userId } = useContext(UserContext);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
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
  const [finalScore, setFinalScore] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, message: '' }); // State for managing notifications
  const [currentTime, setCurrentTime] = useState(new Date());
  const [examEndTime, setExamEndTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/student/${userId}/courses`);
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
  }, [userId, role]);

  useEffect(() => {
    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, [intervalId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // Update the current time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    if (currentTime && examEndTime) {
      if (currentTime.toLocaleTimeString() > examEndTime.toLocaleTimeString()) {
        setIsExamEnded(true);
        setStudentAnswers({});
      } else {
        setIsExamEnded(false);
      }
    }
  }, [currentTime, examEndTime, selectedQuizId]);

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    console.log('courseId', courseId);
    axios
        .get(`/api/exams/${courseId}`)
        .then((response) => {
          setExams(response.data);
        })
        .catch((error) => {
          console.error('Error fetching exams:', error);
        });
    resetExamState();
  };

  const handleExamDetailsSelect = (examId) => {
    resetExamState();
    setSelectedQuizId(examId);
    examApi.fetchExamDetails(examId)
        .then((response) => {
          const details = response.data[0];
          setExamDetails(details);

          console.log("exam details: ", examDetails)

          const startTime = new Date(formatDate(details.start_at));
          const newStartTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours in milliseconds

          console.log("New start time:", newStartTime);

          const durationInMilliseconds = details.duration * 60 * 1000;
          const endTime = new Date(startTime.getTime() + durationInMilliseconds);
          setExamEndTime(endTime);

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

    examApi.fetchExamQuestions(examId)
        .then((response) => {
          setExamQuestions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching exam questions:', error);
        });

    examApi.fetchExamAnswers(examId)
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
    setFinalScore(correctCount);
  };

  const handleSubmit = () => {
    setFinalScore(null);
    let finalStudentScore = 0;
    const answers = examQuestions.map((question) => {
      const answerText = studentAnswers[question.question_id] || '';
      const isCorrect = examAnswers.some(
          (answer) =>
              answer.question_id === question.question_id &&
              answer.answer_text === answerText &&
              answer.is_correct === 1
      );
      let studentQuestionPoints = 0
      if (isCorrect) {
        studentQuestionPoints = question.points;
        finalStudentScore += question.points
      }
      return {
        questionId: question.question_id,
        answerText,
        isCorrect,
        studentQuestionPoints,
      };
    });

    calculateScore();

    examApi.setStudentAnswers(userId, answers, selectedQuizId, finalStudentScore)
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
    examApi.fetchStudentExamStatus(userId, selectedQuizId)
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
    setSelectedCourseId('');
  };

  return (
      <div className={`TakeExam_component ${isDarkMode ? 'dark' : 'light'}`}>
        {!isInExam && !showResults && (
            <div className="TakeExam_select-container">
              <CourseSelect language={language} courses={courses} onSelect={handleCourseSelect} selectedCourse={selectedCourseId}/>
              <ExamSelect language={language} exams={exams} onSelect={handleExamDetailsSelect} />
            </div>
        )}

        {selectedQuizId && !isInExam && !showResults && (
            <div className="TakeExam_exam-details">
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
                    <button onClick={() => handleStartExam()} disabled={isSubmitted}>
                      Start Exam
                    </button>
                  </div>
              )}
              {isExamEnded && (
                  <button onClick={() => setShowResults(true)}>Show Exam Result</button>
              )}
            </div>
        )}

        {isInExam && !showResults && !isExamEnded && (
            <div className="TakeExam_questions-container">
              <div className="TakeExam_timer">{formatTime(timer)}</div>
              {examQuestions.length > 0 && (
                  <div>
                    {examQuestions.map((question, questionIndex) => {
                      const isMCQ = examAnswers.some(
                          (answer) => answer.question_id === question.question_id
                      );
                      return (
                          <div className="TakeExam_question-item" key={questionIndex}>
                            <h3>{question.question_text} ?</h3>
                            <div className={"TakeExam_answers-section"}>
                              {isMCQ ? (
                                  examAnswers
                                      .filter((answer) => answer.question_id === question.question_id)
                                      .map((answer, answerIndex) => (
                                          <button
                                              key={answerIndex}
                                              className={`TakeExam_answer-button ${
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
                                      className={'TakeExam_answers-section-essayAnswer'}
                                      id="essayAnswer"
                                      value={studentAnswers[question.question_id] || ''}
                                      onChange={(e) => handleAnswerSelect(question.question_id, e.target.value)}
                                      required
                                      disabled={isSubmitted}
                                  />
                              )}
                            </div>
                          </div>
                      );
                    })}
                    <div className="TakeExam_navigation-buttons">
                      <button onClick={handleSubmit} disabled={isSubmitted}>
                        Submit
                      </button>
                    </div>
                  </div>
              )}
            </div>
        )}

        {showResults && (
            <div className="TakeExam_results-container">
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

                      <td>{studentAnswers[question.question_id] ? studentAnswers[question.question_id] : '--'}</td>
                      <td>{question.points}</td>
                    </tr>
                ))}
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    Your score
                  </td>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    {finalScore}
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
