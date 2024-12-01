import axios from "./axios";

const fetchStudentsEnrolledInCourse = (selectedCourse, userId) => axios.get(`/api/enrollments/${selectedCourse}/${userId}`);

const enrollmentsApi = { fetchStudentsEnrolledInCourse };
export default enrollmentsApi;