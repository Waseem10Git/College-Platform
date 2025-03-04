import {useContext, useEffect, useState} from 'react';
import './TakeExam.css';
import CourseSelect from '../ExamResults/CourseSelect';
import ExamSelect from '../ExamResults/ExamSelect';
import UserContext from "../../context/UserContext";
import examApi from "../../api/examApi";
import coursesApi from "../../api/coursesApi";

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
  const [isExamsListLoading, setIsExamsListLoading] = useState(false);
  const [isExamDetailsLoading, setIsExamDetailsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, EnMessage: '', ArMessage: '' }); // State for managing notifications
  const [currentTime, setCurrentTime] = useState(new Date());
  const [examEndTime, setExamEndTime] = useState(null);
  const [showTimer, setShowTimer] = useState(true);
  const [studentStartExam, setStudentStartExam] = useState(true);
  const [studentStartExamAt, setStudentStartExamAt] = useState(new Date());

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem(`takeExamData_${userId}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedQuizId(parsedData.selectedQuizId || '');
      setSelectedCourseId(parsedData.selectedCourseId || '');
      setExamDetails(parsedData.examDetails || []);
      setExamQuestions(parsedData.examQuestions || []);
      setExamAnswers(parsedData.examAnswers || []);
      setStudentAnswers(parsedData.studentAnswers || []);
      setIsExamStarted(parsedData.isExamStarted || false);
      setIsExamEnded(parsedData.isExamEnded || false);
      setIsInExam(parsedData.isInExam || false);
      setIsSubmitted(parsedData.isSubmitted || false);
      setShowResults(parsedData.showResults || false);
      setExamEndTime(parsedData.examEndTime || null);
      setStudentStartExam(parsedData.studentStartExam || false);
      setStudentStartExamAt(parsedData.studentStartExamAt || new Date());
    }
  }, []);

  useEffect(() => {
    // Save current state to localStorage whenever it changes
    const takeExamData = {
      selectedQuizId,
      selectedCourseId,
      examDetails,
      examQuestions,
      examAnswers,
      studentAnswers,
      isExamStarted,
      isExamEnded,
      isInExam,
      isSubmitted,
      showResults,
      examEndTime,
      studentStartExam,
      studentStartExamAt
    };
    localStorage.setItem(`takeExamData_${userId}`, JSON.stringify(takeExamData));
  }, [studentAnswers, isInExam === true]);


  // Fetch courses based on userId and role
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await coursesApi.fetchSomeCourses('student', userId);
        setCourses(response.data || []);
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

  // update Timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date()); // Update the current time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  // Update exam status (started/ended) based on time
  useEffect(() => {
    if (selectedQuizId && examEndTime && currentTime) {
      if (currentTime >= examEndTime) {
        setIsExamEnded(true);
        setIsExamStarted(false);
      } else if (currentTime >= new Date(examDetails?.start_at) && !examDetails?.due_date) {
        setIsExamStarted(true);
        startExamCountdown(new Date(examDetails.start_at), examDetails.duration * 60 * 1000, currentTime);
      } else if (currentTime >= new Date(examDetails?.start_at) && examDetails?.due_date) {
        setIsExamStarted(true);
        const dueTime = new Date(examDetails.due_date);
        const startTime = new Date(examDetails.start_at);
        const remainingDueMs = dueTime.getTime() - currentTime.getTime();
        const examDurationMs = examDetails.duration * 60 * 1000;
        const studentEndTime = new Date(studentStartExamAt).getTime() + examDurationMs - currentTime.getTime()
        if (examDurationMs < remainingDueMs && !studentStartExam) {
          setShowTimer(false);
        } else if (examDurationMs < remainingDueMs && studentStartExam) {

          startExamCountdown(startTime, studentEndTime, currentTime);
        } else if (examDurationMs >= remainingDueMs && remainingDueMs >= 0) {
          setShowTimer(true);
          startExamCountdown(startTime, remainingDueMs, currentTime);
        }
      }
    }
  }, [currentTime, examEndTime, examDetails, selectedQuizId]);

  //OLD ----------
  // useEffect(() => {
  //   if (currentTime && examDetails.start_at) {
  //     let startAt = examDetails.start_at;
  //
  //     if (typeof startAt === "string") {
  //       startAt = new Date(startAt);
  //     }
  //
  //     if (startAt instanceof Date && !isNaN(startAt)) {
  //       if (currentTime > startAt) {
  //         setIsExamStarted(true);
  //       }
  //     } else {
  //       console.error("Invalid start_at value:", examDetails.start_at);
  //     }
  //   }
  // }, [currentTime, examDetails.start_at]);

  const handleCourseSelect = async (courseId) => {
    resetExamState()
    // setStudentAnswers({});
    // setSelectedQuizId('');
    setSelectedCourseId(courseId);
    setIsExamsListLoading(true);
    try {
      const response = await examApi.fetchExamsForCourse(courseId);
      setExams(response.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setIsExamsListLoading(false);
    }
  };

  //OLD ----------
  // const handleExamDetailsSelect = (examId) => {
  //   setSelectedQuizId(examId);
  //   examApi.fetchExamDetails(examId)
  //       .then((response) => {
  //         const details = response.data[0];
  //         setExamDetails(details);
  //
  //         const startTime = new Date(formatDate(details.start_at));
  //
  //         const durationInMilliseconds = details.duration * 60 * 1000;
  //         const endTime = new Date(startTime.getTime() + durationInMilliseconds);
  //         setExamEndTime(endTime);
  //
  //         console.log('end Time:', endTime)
  //         console.log(currentTime >= endTime)
  //         if (currentTime >= endTime) {
  //           setIsExamEnded(true);
  //         } else if (currentTime >= startTime && currentTime < endTime) {
  //           setIsExamStarted(true);
  //           startExamCountdown(startTime, durationInMilliseconds, currentTime);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching exam details:', error);
  //       });
  //
  //   examApi.fetchExamQuestions(examId)
  //       .then((response) => {
  //         setExamQuestions(response.data);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching exam questions:', error);
  //       });
  //
  //   examApi.fetchExamAnswers(examId)
  //       .then((response) => {
  //         setExamAnswers(response.data);
  //       })
  //       .catch((error) => {
  //         console.error('Error fetching exam questions:', error);
  //       });
  // };

  const handleExamDetailsSelect = async (examId) => {
    setExamEndTime(null);
    setIsExamStarted(false);
    setIsExamEnded(false);
    setIsInExam(false);
    setExamDetails([]);
    setNotification({isOpen: false, EnMessage: '', ArMessage: ''});

    setSelectedQuizId(examId);
    setIsExamDetailsLoading(true);
    try {
      const [detailsResponse, questionsResponse, answersResponse] = await Promise.all([
        examApi.fetchExamDetails(examId),
        examApi.fetchExamQuestions(examId),
        examApi.fetchExamAnswers(examId),
      ]);

      const details = detailsResponse.data[0];
      setExamDetails(details);
      const startTime = new Date(details.start_at);

      // Calculate the original duration in milliseconds
      const originalDurationMs = details.duration * 60 * 1000;
      let adjustedDurationMs = originalDurationMs;

      // If a due_date exists, adjust the duration if it's shorter than the original duration
      if (details.due_date) {
        const dueTime = new Date(details.due_date);
        const diffMs = dueTime.getTime() - startTime.getTime();
        if (diffMs < originalDurationMs) {
          adjustedDurationMs = diffMs;
        }
      }

      // Optionally update details.duration to reflect the adjusted duration in minutes
      details.duration = Math.floor(adjustedDurationMs / (60 * 1000));
      setExamDetails(details);

      // Set the exam end time based on the adjusted duration
      const endTime = new Date(startTime.getTime() + adjustedDurationMs);
      setExamEndTime(details.due_date || endTime);

      setExamQuestions(questionsResponse.data || []);
      setExamAnswers(answersResponse.data || []);

      // Check the current time to determine exam status
      if (currentTime >= endTime) {
        setIsExamEnded(true);
      } else if (currentTime >= startTime && currentTime < endTime) {
        if (!details.due_date) {
          // No due_date exists; proceed as before.
          setIsExamStarted(true);
          startExamCountdown(startTime, adjustedDurationMs, currentTime);
        } else {

          const dueTime = new Date(details.due_date);
          const remainingDueMs = dueTime.getTime() - currentTime.getTime();
          const examDurationMs = details.duration * 60 * 1000;

          if (examDurationMs < remainingDueMs) {
            setShowTimer(false);
          } else {
            setShowTimer(true);
            startExamCountdown(startTime, remainingDueMs, currentTime);
          }
        }
      }

    } catch (error) {
      console.error('Error fetching exam details:', error);
    } finally {
      setIsExamDetailsLoading(false);
    }
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

  const handleSubmit = async () => {
    localStorage.removeItem("takeExamData");
    setFinalScore(null);
    setIsInExam(false);
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

    try {
      await examApi.setStudentAnswers(userId, answers, selectedQuizId);
    } catch (error) {
      console.error('Error submitting exam:', error);
    } finally {
      setIsSubmitted(true);
      setShowResults(true);
    }
    //OLD ----------
    // examApi.setStudentAnswers(userId, answers, selectedQuizId, finalStudentScore)
    //     .then((response) => {
    //       setIsSubmitted(true);
    //       clearInterval(intervalId);
    //       setShowResults(true);
    //     })
    //     .catch((error) => {
    //       console.error('Error submitting exam:', error);
    //     });

  };
//OLD ----------
  // const handleStartExam = () => {
  //   setStudentInExam(true);
  //   examApi.fetchStudentExamStatus(userId, selectedQuizId)
  //       .then((response) => {
  //         if (response.data.is_submitted) {
  //           setIsSubmitted(true);
  //           setNotification({ isOpen: true, message: 'You have already submitted this exam.' }); // Replace alert
  //         } else {
  //           setIsInExam(true);
  //           const startTime = new Date(formatDate(examDetails.start_at));
  //           const currentTime = new Date();
  //
  //           if (currentTime >= startTime) {
  //             setIsExamStarted(true);
  //             const durationInSeconds = examDetails.duration * 60;
  //             startExamCountdown(startTime, durationInSeconds * 1000, currentTime);
  //           } else {
  //             setNotification({ isOpen: true, message: 'Exam has not started yet. Please wait until the start time.' }); // Replace alert
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error checking exam status:', error);
  //       });
  // };

  const handleStartExam = async () => {
    if (!isExamStarted) {
      setNotification({ isOpen: true, EnMessage: 'Exam has not started yet', ArMessage: 'الإمتحان لم يبدأ بعد' });
      return;
    }

    if (isExamEnded) {
      setNotification({ isOpen: true, EnMessage: 'Exam has already ended', ArMessage: 'لقد انتهى الإمتحان بالفعل' });
      return;
    }
    try {
      const response = await examApi.fetchStudentExamStatus(userId, selectedQuizId);
      if (response.data.is_submitted) {
        setIsSubmitted(true);
        setNotification({ isOpen: true, EnMessage: 'You have already submitted this exam', ArMessage: 'لقد قمت بالفعل بإنهاء هذا الإمتحان' });
      } else {
        setIsInExam(true);
        const startTime = new Date(examDetails.start_at);
        if (currentTime >= startTime) {
          setIsExamStarted(true);
          setStudentStartExam(true);
          setStudentStartExamAt(currentTime);
          // const durationInMilliseconds = examDetails.duration * 60 * 1000;
          // startExamCountdown(startTime, durationInMilliseconds, currentTime);
        } else {
          setNotification({ isOpen: true, EnMessage: 'Exam has not started yet. Please wait', ArMessage: 'لم يبدأ الإمتحان بعد. الرجاء الانتظار' });
        }
      }
    } catch (error) {
      console.error('Error starting exam:', error);
    }
  };
//OLD ----------
  // const startExamCountdown = (startTime, durationInMilliseconds, currentTime) => {
  //   clearInterval(intervalId);
  //   const remainingTime = Math.max(
  //       (startTime.getTime() + durationInMilliseconds - currentTime.getTime()) / 1000,
  //       0
  //   );
  //   setTimer(Math.floor(remainingTime));
  //
  //   const newIntervalId = setInterval(() => {
  //     setTimer((prevTimer) => {
  //       if (prevTimer <= 1) {
  //         clearInterval(newIntervalId);
  //         setIsExamEnded(true);
  //         if (studentInExam) {
  //           setStudentInExam(false);
  //           handleSubmit();
  //         }
  //         return 0;
  //       }
  //       return prevTimer - 1;
  //     });
  //   }, 1000);
  //   setIntervalId(newIntervalId);
  // };

  const startExamCountdown = (startTime, durationInMilliseconds, currentTime) => {
    clearInterval(intervalId);
    let remainingTime ;
    if (examDetails.due_date) {
      remainingTime = Math.min(
          durationInMilliseconds,
          (new Date(examDetails.due_date)?.getTime() || Infinity) - currentTime.getTime()
      ) / 1000;
    } else {
      remainingTime = Math.max(
            (startTime.getTime() + durationInMilliseconds - currentTime.getTime()) / 1000,
            0
        );
    }
    setTimer(Math.floor(remainingTime));

    const newIntervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(newIntervalId);
          setIsExamEnded(true);
          if (isInExam) {
            handleSubmit();
          }
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
    // setStudentAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
    setIsInExam(false);
    setSelectedQuizId('');
    setSelectedCourseId('');
    setNotification({isOpen: false, EnMessage: '', ArMessage: ''});
    setStudentStartExam(false);
  };

  return (
      <div className={`TakeExam_component ${isDarkMode ? 'dark' : 'light'}`}>
        {!isInExam && !showResults && (
            <div className="TakeExam_select-container">
              <CourseSelect language={language} courses={courses} onSelect={handleCourseSelect} selectedCourse={selectedCourseId}/>
              { selectedCourseId && exams.length > 0 ? (
                  <ExamSelect language={language} exams={exams} onSelect={handleExamDetailsSelect} />
              ) : selectedCourseId && !isExamsListLoading ? (
                  <h3>{language === 'En' ? 'No exams for selected course' : 'ليس هناك أي إمتحان لهاذه المادة'}</h3>
              ) : isExamsListLoading && (
                  <h3>{language === 'En' ? 'Loading...' : 'جاري التحميل...'}</h3>
              )}
            </div>
        )}

        {selectedQuizId && !isInExam && !showResults && (
            !isExamDetailsLoading ?
                <div className="TakeExam_exam-details">
                  <h3>{examDetails.exam_name}</h3>
                  {!isExamEnded ?
                      <h3>{language === 'En' ? 'Duration:' : 'مدة الإمتحان:'} {examDetails.duration} {language === 'En' ? 'minutes' : 'دقيقة'}</h3>
                      : null
                  }
                  <p>
                    {isExamEnded
                        ? language === 'En' ? 'Exam End' : 'إنتهى الإمتحان'
                        : isExamStarted
                            ? language === 'En' ? 'Exam Started' : 'بدأ الإمتحان'
                            : `${language === 'En' ? 'Start Time:' : 'وقت البدء:'} ${formatDate(examDetails.start_at)}`}
                  </p>
                  {!isExamEnded && !isInExam && examDetails.due_date && (
                      <p>{language === 'En' ? 'Due Date:' : 'تاريخ الإنتهاء:'} {formatDate(examDetails.due_date)}</p>
                  )}
                  <p>{language === 'En' ? 'Number of questions:' : 'عدد الأسئلة:'} {examQuestions.length}</p>
                  {isExamStarted && !isExamEnded && !isInExam ? (
                      <div>
                        {showTimer && (
                            <p>{language === 'En' ? 'Time Remaining:' : 'الوقت المتبقي:'} {formatTime(timer)}</p>
                        )}
                        <button onClick={() => handleStartExam()}>
                        {language === 'En' ? 'Start Exam' : 'بدأ الإمتحان'}
                        </button>
                        {notification.isOpen && (
                            <p>{language === 'En' ? notification.EnMessage : notification.ArMessage}</p>
                        )}
                      </div>
                  ) : null}
                </div>
                :
                <h3>{language === 'En' ? 'Loading...' : 'جاري التحميل...'}</h3>
        )}

        {isInExam && !showResults && !isExamEnded && (
            <div className="TakeExam_questions-container">
              <div className="TakeExam_timer-sticky">
                <div className="TakeExam_timer">{formatTime(timer)}</div>
              </div>
              {examQuestions.length > 0 && (
                  <div>
                    {examQuestions.map((question, questionIndex) => {
                      const isMCQ = examAnswers.some(
                          (answer) => answer.question_id === question.question_id
                      );
                      return (
                          <div className="TakeExam_question-item" key={questionIndex}>
                            <h3>{question.question_text} {language === 'En' ? '?' : '؟'}</h3>
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
                                      placeholder={language === 'En' ? 'Type your answer' : 'أكتب إجابتك'}
                                      disabled={isSubmitted}
                                  />
                              )}
                            </div>
                          </div>
                      );
                    })}
                    <div className="TakeExam_navigation-buttons">
                      <button onClick={handleSubmit} disabled={isSubmitted}>
                        {language === 'En' ? 'Submit' : 'تأكيد'}
                      </button>
                    </div>
                  </div>
              )}
            </div>
        )}

        {showResults && (
            <div className="TakeExam_results-container">
              <h2>{language === 'En' ? 'Exam Result' : 'نتيجة الإمتحان'}</h2>
              <table>
                <thead>
                <tr>
                  <th>{language === 'En' ? 'Question' : 'السؤال'}</th>
                  <th>{language === 'En' ? 'Correct Answer' : 'الإجابة الصحيحة'}</th>
                  <th>{language === 'En' ? 'Your Answer' : 'إجابتك'}</th>
                  <th>{language === 'En' ? 'Question Score' : 'درجة السؤال'}</th>
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
                            : language === 'En' ? '(Essay)' : '(مقالي)'}
                      </td>

                      <td>{studentAnswers[question.question_id] ? studentAnswers[question.question_id] : '--'}</td>
                      <td>{question.points}</td>
                    </tr>
                ))}
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    {language === 'En' ? 'Your score' : 'نتيجتك'}
                  </td>
                  <td colSpan={2} style={{ textAlign: 'center' }}>
                    {finalScore}
                  </td>
                </tr>
                </tbody>
              </table>
              <button
                  className={'TakeExam_back-button'}
                  onClick={() => {
                    resetExamState();
                    setExams([]);
                  }}
              >
                {language === 'En' ? 'Back' : 'رجوع'}
              </button>
            </div>
        )}
      </div>
  );
};

export default TakeExam;