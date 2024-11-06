import axios from "./axios";

const fetchDepartment = () => axios.get(`/api/departments`);
const addDepartment = name => axios.post('/api/departments', { department_name: name });
const editDepartment = (id, name) => axios.put(`/api/departments/${id}`, { department_name: name });
const deleteDepartment = id => axios.delete(`/api/departments/${id}`);

const departmentApi = { fetchDepartment, addDepartment, editDepartment, deleteDepartment };
export default departmentApi;