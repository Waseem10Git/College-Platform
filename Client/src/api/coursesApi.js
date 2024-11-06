import axios from './axios'

const fetchCourses = () => axios.get('/api/courses', {responseType: 'json'});
const addCourse = data => axios.post('/api/courses', data);
const editCourse = (courseId, data) => axios.put(`/api/courses/${courseId}`, data);
const deleteCourse = id => axios.delete(`/api/courses/${id}`);

const coursesApi = { fetchCourses, addCourse, editCourse, deleteCourse };
export default coursesApi;