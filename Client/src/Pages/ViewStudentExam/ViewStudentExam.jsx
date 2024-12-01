import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

function ViewStudentExam({ examId, studentId, setViewExamDetails, language }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [newQuestionPoints, setNewQuestionPoints] = useState(0);
    const [editingPoints, setEditingPoints] = useState(null);
    const [enrollmentExamId, setEnrollmentExamId] = useState(null);

    // Fetch questions and answers
    const fetchExamData = async () => {
        try {
            console.log(studentId, examId);
            const response = await axios.get(`/api/studentExamDetails/${studentId}/${examId}`);
            console.log("Backend response:", response.data);
            setEnrollmentExamId(response.data[0].enrollment_exam_id);
            const groupedQuestions = groupByQuestions(response.data);
            console.log(groupedQuestions);
            setQuestions(groupedQuestions);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch data");
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchExamData();
    }, [examId, studentId]);

    // const handleEditPoints = async (questionId, newPoints) => {
    //     try {
    //         await axios.patch(`/api/studentExam/question/${questionId}`, { points: newPoints });
    //         // Update state locally
    //         setQuestions(prevQuestions =>
    //             prevQuestions.map(q =>
    //                 q.id === questionId ? { ...q, points: newPoints } : q
    //             )
    //         );
    //         setTotalScore(prevScore =>
    //             prevScore - questions.find(q => q.id === questionId).points + newPoints
    //         );
    //     } catch (err) {
    //         alert("Failed to update points");
    //     }
    // };

    const editQuestionPoints = async (questionId) => {
        try {
            console.log(questionId, newQuestionPoints, enrollmentExamId)
            await axios.put(`/api/studentExam/essayQuestion/${questionId}`, {newQuestionPoints, enrollmentExamId});
            fetchExamData();
            setEditingPoints(null);
        } catch (err) {
            console.error('err in editing question point', err);
            setEditingPoints(null)
        }
    }

    // Grouping data by question_id
    const groupByQuestions = (data) => {
        const grouped = data.reduce((acc, item) => {
            const { question_id, question_text, question_type, question_points, student_answer, student_answer_points, is_student_answer_correct } = item;
            const answer = {
                answer_id: item.answer_id,
                answer_text: item.answer_text,
                is_answer_correct: item.is_answer_correct,
            };

            if (!acc[question_id]) {
                acc[question_id] = {
                    question_id,
                    question_text,
                    question_type,
                    question_points,
                    student_answer,
                    student_answer_points,
                    is_student_answer_correct,
                    answers: [],
                };
            }

            acc[question_id].answers.push(answer);
            return acc;
        }, {});

        return Object.values(grouped); // Convert object to array
    };

    // Calculate Total and Student Score
    const totalPoints = questions.reduce((sum, q) => sum + q.question_points, 0);
    const studentScore = questions.reduce(
        (sum, q) => (q.is_student_answer_correct ? sum + q.question_points : sum),
        0
    );

    if (loading) return <p>{language === "En" ? "Loading..." : "جار التحميل..."}</p>;

    return (
        <div>
            <h2>{language === "En" ? "Student Exam Review" : "مراجعة امتحان الطالب"}</h2>
            <p>
                {language === "En" ? "Total Score:" : "الدرجة الكلية:"} {studentScore} / {totalPoints}
            </p>
            <table>
                <thead>
                <tr>
                    <th className="examResultDetails_th">
                        {language === 'Ar' ? 'السؤال' : 'Question'}
                    </th>
                    <th className="examResultDetails_th">
                        {language === 'Ar' ? 'الإجابة الصحيحة' : 'Correct Answer'}
                    </th>
                    <th className="examResultDetails_th">
                        {language === 'Ar' ? 'إجابتك' : 'Your Answer'}
                    </th>
                    <th className="examResultDetails_th">
                        {language === 'Ar' ? 'الدرجة' : 'Score'}
                    </th>
                    <th>
                        {language === "En" ? "Edit" : "تعديل"}
                    </th>
                </tr>
                </thead>
                <tbody>
                {questions.map((question) => (
                    <tr key={question.question_id} className="examResultDetails_tr">
                        <td className="examResultDetails_td">{question.question_text}</td>
                        {question.answers[0].answer_id ?
                            <td className="examResultDetails_td">
                                {question.answers.filter((answer) => answer.is_answer_correct).map((answer) => (answer.answer_text))}
                            </td>
                            :
                            <td className="examResultDetails_td">
                                (Essay)
                            </td>
                        }
                        <td className="examResultDetails_td">{question.student_answer ? question.student_answer : '--'}</td>
                        <td>
                            {editingPoints === question.question_id ? (
                                <input
                                    type="number"
                                    min="0"
                                    value={question.student_answer_points}
                                    onChange={e => setNewQuestionPoints(parseInt(e.target.value))}
                                />
                            ) : (
                                `${question.student_answer_points ? question.student_answer_points : 0} / ${question.question_points}`
                            )}
                        </td>
                        <td>
                            {question.question_type === 'Essay' ? (
                                editingPoints === question.question_id ? (
                                    <>
                                        <button onClick={() => editQuestionPoints(question.question_id)}>Save</button>
                                        <button onClick={() => setEditingPoints(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditingPoints(question.question_id)}>Edit</button>
                                )
                            ) : (
                                language === 'En' ? "Can't Edit" : "لا يمكن تعديله"
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button
                className="submit-edit-button"
                onClick={() => setViewExamDetails(false)}
            >
                {language === "En" ? "Back" : "رجوع"}
            </button>
        </div>
    );
}

export default ViewStudentExam;
