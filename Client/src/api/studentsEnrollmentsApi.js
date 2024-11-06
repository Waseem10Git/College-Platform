import axios from "./axios";

const fetchStudentsEnrollments = () => axios.get('/api/students-enrollments');
const enrollStudent = (selectedStudent, newInstructorCourse) => axios.post('/api/students-enrollments', {
    student_id: selectedStudent,
    instructor_course_ids: newInstructorCourse
});
const deleteStudentEnrollment = id => axios.delete(`/api/students-enrollments/${id}`);

const studentsEnrollmentsApi = { fetchStudentsEnrollments, enrollStudent, deleteStudentEnrollment };
export default studentsEnrollmentsApi;