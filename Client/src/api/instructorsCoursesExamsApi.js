import axios from "./axios";

const assignExamToCourse = (selectedCourse, userId, exam_id) => axios.post('/api/instructorsCoursesExams', {
    course_code: selectedCourse,
    instructor_id: userId,
    exam_id: exam_id
});

const instructorsCoursesExamsApi = { assignExamToCourse };
export default instructorsCoursesExamsApi;