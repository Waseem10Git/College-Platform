import axios from './axios';

const fetchData = () => axios.get('/api/instructors-departments-courses');
const addInstructorCourse = (selectedInstructor, newDepartmentCourse) => axios.post('/api/instructors-enrollments', {
    instructor_id: selectedInstructor,
    department_course_ids: newDepartmentCourse
});
const deleteInstructorCourse = id => axios.delete(`/api/instructors-enrollments/${id}`);

const instructorsCoursesApi = { fetchData, addInstructorCourse, deleteInstructorCourse };
export default instructorsCoursesApi;