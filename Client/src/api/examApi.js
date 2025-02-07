import axios from "./axios";

const fetchExamsForCourse = selectedCourse => axios.get(`/api/exams/${selectedCourse}`);
const fetchExamsWithStudents = examId => axios.get(`/api/exam-results/${examId}`);
const createExam = (examName, duration, startAtUTC, dueDateUTC, totalPoints, selectedCourse, userId) => axios.post('/api/exams', {
    exam_name: examName,
    duration: duration,
    start_at: startAtUTC,
    due_date: dueDateUTC,
    score: totalPoints,
    selectedCourse: selectedCourse,
    userId: userId
});
const fetchExamDetails = examId => axios.get(`/api/exams-details/${examId}`);
const fetchExamQuestions = examId => axios.get(`/api/exams-questions/${examId}`);
const fetchExamAnswers = examId => axios.get(`/api/exams-answers/${examId}`);
const fetchStudentExamStatus = (userId, selectedQuizId) => axios.get(`/api/student-exam-status/${userId}/${selectedQuizId}`);
const setStudentAnswers = (userId, answers, selectedQuizId, finalScore) => axios.post(`/api/student-answers/${userId}`, {
    answers,
    examId: selectedQuizId,
    score: finalScore,
})

const examApi = { fetchExamsForCourse, createExam, fetchExamsWithStudents, fetchExamDetails, fetchExamQuestions, fetchExamAnswers, fetchStudentExamStatus, setStudentAnswers };
export default examApi;