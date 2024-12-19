import axios from './axios'

const fetchUsers = () => axios.get(`/api/users`);
const fetchInstructors = () => axios.get(`/api/instructors`);
const fetchStudents = () => axios.get('/api/students');
const fetchLastUserId = () => axios.get('/api/users/lastUserId');

const usersApi = { fetchUsers, fetchInstructors, fetchStudents, fetchLastUserId };
export default usersApi;