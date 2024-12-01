import axios from "./axios";

const fetchAssignmentsForCourse = selectedCourse => axios.get(`/api/assignments/${selectedCourse}`);
const fetchAssignmentsWithStudents = (assignmentId) => axios.get(`/api/assignments/${assignmentId}/students`);
const viewAssignment = studentAssignmentId => axios.get(`/api/studentAssignment/${studentAssignmentId}/view`, {
    responseType: 'blob',
});
const uploadAssignmentByInstructor = data => axios.post('/api/upload-assignment', data);
const editStudentAssignmentScore = (studentAssignmentId, score) => axios.put(`/api/studentAssignmentScore/${studentAssignmentId}`, {score});
const downloadAssignment = assignmentId => axios.get(`/api/assignments/${assignmentId}/download`, {
    responseType: 'blob',
});
const viewInstructorAssignment = assignmentId => axios.get(`/api/assignments/${assignmentId}/view`, {
    responseType: 'blob',
});

const assignmentsApi = {
    fetchAssignmentsForCourse,
    uploadAssignmentByInstructor,
    fetchAssignmentsWithStudents,
    viewAssignment,
    editStudentAssignmentScore,
    downloadAssignment,
    viewInstructorAssignment
};
export default assignmentsApi;