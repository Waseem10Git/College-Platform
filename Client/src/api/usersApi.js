import axios from './axios'

const fetchUsers = () => axios.get(`/api/users`);
const fetchInstructors = () => axios.get(`/api/instructors`);
const fetchStudents = () => axios.get('/api/students');

const usersApi = { fetchUsers, fetchInstructors, fetchStudents };
export default usersApi;