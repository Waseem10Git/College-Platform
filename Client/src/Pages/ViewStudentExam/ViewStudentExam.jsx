import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import './ViewStudentExam.css'

function ViewStudentExam({examId, studentId, setViewExamDetails, language, isDarkMode, refreshData}) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalScore, setTotalScore] = useState(0);
    const [newQuestionPoints, setNewQuestionPoints] = useState(0);
    const [editingPoints, setEditingPoints] = useState(null);
    const [enrollmentExamId, setEnrollmentExamId] = useState(null);
    const [inputError, setInputError] = useState("");

    // Fetch questions and answers
    const fetchExamData = async () => {
        try {
            const response = await axios.get(
                `/api/studentExamDetails/${studentId}/${examId}`
            );
            setEnrollmentExamId(response.data[0].enrollment_exam_id);
            const groupedQuestions = groupByQuestions(response.data);
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

    const editQuestionPoints = async (questionId) => {
        if (newQuestionPoints < 0 || newQuestionPoints > questions.find(q => q.question_id === questionId).question_points) {
            setInputError(language === "En"
                ? "Points must be between 0 and the maximum question points."
                : "يجب أن تكون النقاط بين 0 والحد الأقصى لنقاط السؤال.");
            return;
        }

        try {
            await axios.put(`/api/studentExam/essayQuestion/${questionId}`, {
                newQuestionPoints,
                enrollmentExamId,
                examId,
            });
            setEditingPoints(null);
            setInputError(""); // Clear error on success
            fetchExamData();
            refreshData();
        } catch (err) {
            console.error("Error editing question points:", err);
            setEditingPoints(null);
        }
    };

    const handlePointsChange = (e, maxPoints) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 0 || value > maxPoints) {
            setInputError(language === "En"
                ? "Points must be between 0 and the maximum question points."
                : "يجب أن تكون النقاط بين 0 والحد الأقصى لنقاط السؤال.");
        } else {
            setInputError("");
            setNewQuestionPoints(value);
        }
    };

    // Grouping data by question_id
    const groupByQuestions = (data) => {
        const grouped = data.reduce((acc, item) => {
            const {
                question_id,
                question_text,
                question_type,
                question_points,
                student_answer,
                student_answer_points,
                is_student_answer_correct,
            } = item;
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

    if (loading)
        return <p>{language === "En" ? "Loading..." : "جار التحميل..."}</p>;

    return (
        <div
            className={`ViewStudentExam_container ${isDarkMode ? "dark" : "light"}`}
        >
            <h2>
                {language === "En" ? "Student Exam Review" : "مراجعة امتحان الطالب"}
            </h2>
            <table
                className={`examResultDetails_table ${isDarkMode ? "dark" : "light"}`}
                style={language === 'En' ? {textAlign: "left"} : {textAlign:'right'}}
            >
                <thead>
                <tr>
                    <th
                        className={`examResultDetails_th ${
                            isDarkMode ? "dark" : "light"
                        }`}
                    >
                        {language === "Ar" ? "السؤال" : "Question"}
                    </th>
                    <th
                        className={`examResultDetails_th ${
                            isDarkMode ? "dark" : "light"
                        }`}
                    >
                        {language === "Ar" ? "الإجابة الصحيحة" : "Correct Answer"}
                    </th>
                    <th
                        className={`examResultDetails_th ${
                            isDarkMode ? "dark" : "light"
                        }`}
                    >
                        {language === "Ar" ? "إجابة الطالب" : "Student Answer"}
                    </th>
                    <th
                        className={`examResultDetails_th ${
                            isDarkMode ? "dark" : "light"
                        }`}
                    >
                        {language === "Ar" ? "الدرجة" : "Score"}
                    </th>
                    <th
                        className={`examResultDetails_th ${
                            isDarkMode ? "dark" : "light"
                        }`}
                    >
                        {language === "En" ? "Edit" : "تعديل"}
                    </th>
                </tr>
                </thead>
                <tbody>
                {questions.map((question) => (
                    <tr
                        key={question.question_id}
                        className={`examResultDetails_tr ${
                            isDarkMode ? "dark" : "light"
                        }`}
                    >
                        <td
                            className={`examResultDetails_td ${
                                isDarkMode ? "dark" : "light"
                            }`}
                        >
                            {question.question_text}
                        </td>
                        {question.answers[0].answer_id ? (
                            <td
                                className={`examResultDetails_td ${
                                    isDarkMode ? "dark" : "light"
                                }`}
                            >
                                {question.answers
                                    .filter((answer) => answer.is_answer_correct)
                                    .map((answer) => answer.answer_text)}
                            </td>
                        ) : (
                            <td
                                className={`examResultDetails_td ${
                                    isDarkMode ? "dark" : "light"
                                }`}
                            >
                                {language === 'En' ? '(Essay)' : '(مقالي)'}
                            </td>
                        )}
                        <td
                            className={`examResultDetails_td ${
                                isDarkMode ? "dark" : "light"
                            }`}
                        >
                            {question.student_answer ? question.student_answer : "--"}
                        </td>
                        <td
                            className={`examResultDetails_td ${
                                isDarkMode ? "dark" : "light"
                            }`}
                        >
                            {editingPoints === question.question_id ? (
                                <>
                                    {inputError && (
                                        <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>{inputError}</p>
                                    )}
                                    <input
                                        type="number"
                                        min="0"
                                        value={newQuestionPoints}
                                        onChange={(e) => handlePointsChange(e, question.question_points)}
                                    />
                                </>
                            ) : (
                                `${question.student_answer_points || 0} / ${question.question_points}`
                            )}
                        </td>
                        <td
                            className={`examResultDetails_td ${
                                isDarkMode ? "dark" : "light"
                            }`}
                        >
                            {question.question_type === "Essay" ? (
                                editingPoints === question.question_id ? (
                                    <>
                                        <button
                                            className={`examResultDetails_submit-edit-button ${isDarkMode ? "dark" : ""}`}
                                            onClick={() => editQuestionPoints(question.question_id)}
                                        >
                                            {language === "En" ? "Save" : "حفظ"}
                                        </button>
                                        <button
                                            id={'examResultDetails_red-button'}
                                            className={`examResultDetails_submit-edit-button ${isDarkMode ? "dark" : ""}`}
                                            onClick={() => setEditingPoints(null)}>
                                            {language === "En" ? "Cancel" : "إلغاء"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        id={'examResultDetails_orange-button'}
                                        className={`examResultDetails_submit-edit-button ${isDarkMode ? "dark" : ""}`}
                                        onClick={() => {
                                            setEditingPoints(question.question_id)
                                            setNewQuestionPoints(question.student_answer_points)
                                        }}
                                    >
                                        {language === "En" ? "Edit" : "تعديل"}
                                    </button>
                                )
                            ) : language === "En" ? (
                                "Can't Edit"
                            ) : (
                                "لا يمكن تعديله"
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button
                id={'examResultDetails_gray-button'}
                className={`examResultDetails_submit-edit-button ${isDarkMode ? "dark" : ""}`}
                onClick={() => setViewExamDetails(false)}
            >
                {language === "En" ? "Back" : "رجوع"}
            </button>
        </div>
    );
}

export default ViewStudentExam;
