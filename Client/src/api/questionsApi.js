import axios from "./axios";

const addQuestionsToExam = (exam_id, question, questionType, points) => axios.post('/api/questions', {
    exam_id,
    question_type: questionType,
    question_text: question,
    points: points,
});

const questionsApi = { addQuestionsToExam };
export default questionsApi;