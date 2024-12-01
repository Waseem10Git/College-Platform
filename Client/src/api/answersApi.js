import axios from "./axios";

const addAnswersToQuestions = (question_id, question, i) => axios.post('/api/answers', {
    question_id,
    answer_text: question.options[i],
    is_correct: i === question.correctAnswer,
});

const answersApi = { addAnswersToQuestions };
export default answersApi;