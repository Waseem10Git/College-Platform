import axios from './axios'

const fetchAllCourses = () => axios.get('/api/courses');
const fetchSomeCourses = (userType, userId) => axios.get(`/api/${userType}/${userId}/courses`);
const addCourse = data => axios.post('/api/courses', data);
const editCourse = (courseId, data) => axios.put(`/api/courses/${courseId}`, data);
const deleteCourse = id => axios.delete(`/api/courses/${id}`);

const coursesApi = { fetchAllCourses, fetchSomeCourses, addCourse, editCourse, deleteCourse };
export default coursesApi;