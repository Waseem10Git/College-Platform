import React, { useContext, useState, useEffect } from 'react';
import './ExamResultDetails.css';
import UserContext from '../../context/UserContext';
import axios from '../../api/axios';
import coursesApi from "../../api/coursesApi";
import CourseSelect from "../ExamResults/CourseSelect";
import ExamSelect from "../ExamResults/ExamSelect";

const ExamResultDetails = () => {
  const { language, isDarkMode, role, userId } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesApi.fetchSomeCourses(role, userId);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

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
  };

  const handleExamDetailsSelect = async (examId) => {
    setSelectedQuizId(examId);
    try {
      setIsLoading(true);
      console.log(userId, examId);
      const response = await axios.get(`/api/studentExamDetails/${userId}/${examId}`);
      console.log("Backend response:", response.data);
      const groupedQuestions = groupByQuestions(response.data);
      console.log(groupedQuestions);
      setQuestions(groupedQuestions);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching exam details:", err);
      setError("Failed to load exam details.");
      setIsLoading(false);
    }
  };

  // Grouping data by question_id
  const groupByQuestions = (data) => {
    const grouped = data.reduce((acc, item) => {
      const { question_id, question_text, question_points, student_answer, is_student_answer_correct } = item;
      const answer = {
        answer_id: item.answer_id,
        answer_text: item.answer_text,
        is_answer_correct: item.is_answer_correct,
      };

      if (!acc[question_id]) {
        acc[question_id] = {
          question_id,
          question_text,
          question_points,
          student_answer,
          is_student_answer_correct,
          answers: [],
        };
      }

      acc[question_id].answers.push(answer);
      return acc;
    }, {});

    return Object.values(grouped); // Convert object to array
  };

  // Calculate Total and Student Score
  const totalPoints = questions.reduce((sum, q) => sum + q.question_points, 0);
  const studentScore = questions.reduce(
      (sum, q) => (q.is_student_answer_correct ? sum + q.question_points : sum),
      0
  );

  return (
      <div
          className={`examResultDetails_quizResult ${isDarkMode ? 'dark' : 'light'}`}
          dir={language === 'Ar' ? 'rtl' : 'ltr'}
      >
        <div className="TakeExam_select-container">
          <CourseSelect language={language} courses={courses} onSelect={handleCourseSelect} selectedCourse={selectedCourseId}/>
          <ExamSelect language={language} exams={exams} onSelect={handleExamDetailsSelect}/>
        </div>

        {!isLoading ? (
            <>
              <div className="examResultDetails_resultsTable">
                {questions.length > 0 && (
                    <table className="examResultDetails_table">
                      <thead>
                      <tr>
                        <th className="examResultDetails_th">
                          {language === 'Ar' ? 'السؤال' : 'Question'}
                        </th>
                        <th className="examResultDetails_th">
                          {language === 'Ar' ? 'الإجابة الصحيحة' : 'Correct Answer'}
                        </th>
                        <th className="examResultDetails_th">
                          {language === 'Ar' ? 'إجابتك' : 'Your Answer'}
                        </th>
                        <th className="examResultDetails_th">
                          {language === 'Ar' ? 'الدرجة' : 'Score'}
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      {questions.map((question) => (
                          <tr key={question.question_id} className="examResultDetails_tr">
                            <td className="examResultDetails_td">{question.question_text}</td>
                            {question.answers[0].answer_id ?
                                <td className="examResultDetails_td">
                                  {question.answers.filter((answer) => answer.is_answer_correct).map((answer) => (answer.answer_text))}
                                </td>
                                :
                                <td className="examResultDetails_td">
                                  (Essay)
                                </td>
                            }
                            <td className="examResultDetails_td">{question.student_answer ? question.student_answer : '--'}</td>
                            <td className="examResultDetails_td">
                              {question.is_student_answer_correct ? question.question_points : 0} / {question.question_points}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                )}
              </div>

              {questions.length > 0 && (
                  <div className="examResultDetails_score">
                    <p className="examResultDetails_p">
                      {language === 'Ar' ? 'درجتك: ' : 'Your Score: '} {studentScore}
                    </p>
                    <p className="examResultDetails_p">
                      {language === 'Ar' ? 'الدرجة الكاملة: ' : 'Total Score: '} {totalPoints}
                    </p>
                  </div>
              )}
            </>
        ) : (
            <h3>Loading...</h3>
        )}
      </div>
  );
};

export default ExamResultDetails;
