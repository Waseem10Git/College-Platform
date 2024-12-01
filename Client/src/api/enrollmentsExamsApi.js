import axios from "./axios";

const assignExamToStudent = (selectedCourse, userId, exam_id) => axios.post('/api/enrollmentsExams', {
    course_code: selectedCourse,
    instructor_id: userId,
    exam_id: exam_id
});
const editExamStudentScore = (studentExamId, score) => axios.put(`/api/studentExamScore/${studentExamId}`, {score});

const enrollmentsExamsApi = { assignExamToStudent, editExamStudentScore };
export default enrollmentsExamsApi;