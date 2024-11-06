import axios from "./axios";

const fetchDepartmentsCourses = () => axios.get('/api/departments-courses');
const addDepartmentCourse = (newDepartment, newCourse, newLevel, newSemester) => axios.post('/api/departments-courses', {
    department_id: newDepartment,
    course_id: newCourse,
    level: newLevel,
    semester: newSemester
});
const updateDepartmentCourse = (editingCourse, selectedDepartment, selectedCourse, selectedLevel, selectedSemester) => axios.put(`/api/departments-courses/${editingCourse}`, {
    department_id: selectedDepartment || undefined,
    course_id: selectedCourse || undefined,
    level: selectedLevel || undefined,
    semester: selectedSemester || undefined
});
const deleteDepartmentCourse = id => axios.delete(`/api/departments-courses/${id}`);

const departmentsCoursesApi = { fetchDepartmentsCourses, addDepartmentCourse, updateDepartmentCourse, deleteDepartmentCourse };
export default departmentsCoursesApi;