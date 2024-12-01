import { useState } from "react";
import enrollmentsExamsApi from "../../api/enrollmentsExamsApi";
import {ViewStudentExam} from "../../Pages";

function StudentsExams({ students, examId, language, refreshData, viewExamDetails, setViewExamDetails }) {
    const [editingScore, setEditingScore] = useState(null);
    const [newScore, setNewScore] = useState("");
    const [studentId, setStudentId] = useState(null);

    const handleEditClick = (studentId, currentScore) => {
        setEditingScore(studentId); // Set the student ID for editing
        setNewScore(currentScore || ""); // Set current score or empty string if no score
    };

    const handleScoreChange = (e) => {
        setNewScore(e.target.value); // Update the score in the input
    };

    const saveScore = async (studentExamId) => {
        try {
            console.log(studentExamId, newScore);
            // Send the updated score to the backend
            await enrollmentsExamsApi.editExamStudentScore(studentExamId, newScore);

            console.log("Score updated successfully");

            // Call the parent's function to fetch updated data
            refreshData();

            setEditingScore(null); // Exit editing mode
        } catch (error) {
            console.error("Error updating score", error);
        }
    };

    return (
        <div>
            {!viewExamDetails ? (
                <div>
                    <h2>{language === "En" ? "Student Results" : "نتائج الطلاب"}</h2>
                    <div>
                        {students.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>{language === "En" ? "ID" : "الرقم التعريفي"}</th>
                                    <th>{language === "En" ? "Student Name" : "اسم الطالب"}</th>
                                    <th>{language === "En" ? "Score" : "النتيجة"}</th>
                                    <th>{language === "En" ? "Submitted" : "تم"}</th>
                                    <th>{language === "En" ? "View / Edit Score" : "عرض / تعديل النتيجة"}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.student_id}</td>
                                        <td>{student.student_name}</td>
                                        <td>
                                            {editingScore === student.student_exam_id ? (
                                                <input
                                                    type="number"
                                                    value={newScore}
                                                    onChange={handleScoreChange}
                                                    placeholder={
                                                        language === "En"
                                                            ? "Enter score"
                                                            : "أدخل الدرجة"
                                                    }
                                                />
                                            ) : (
                                                student.score != null && student.score >= 0 ? student.score : '--'
                                            )}
                                        </td>
                                        <td>{student.is_submitted ? "Yes" : "No"}</td>
                                        <td>
                                            {!editingScore && (
                                                <button
                                                    className="submit-edit-button"
                                                    onClick={() => {
                                                        setViewExamDetails(true);
                                                        setStudentId(student.student_id);
                                                    }}
                                                >
                                                    {language === "En" ? "Exam" : "الامتحان"}
                                                </button>
                                            )}
                                            {editingScore === student.student_exam_id ? (
                                                <>
                                                    <button
                                                        className="submit-edit-button"
                                                        onClick={() => saveScore(student.student_exam_id)}
                                                    >
                                                        {language === "En" ? "Save" : "حفظ"}
                                                    </button>
                                                    <button
                                                        className="submit-edit-button"
                                                        onClick={() => setEditingScore(null)}
                                                    >
                                                        {language === "En" ? "Cancel" : "إلغاء"}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="submit-edit-button"
                                                    onClick={() => handleEditClick(student.student_exam_id, student.score)}
                                                >
                                                    {student.score
                                                        ? language === "En"
                                                            ? "Edit Score"
                                                            : "تعديل الدرجة"
                                                        : language === "En"
                                                            ? "Give Score"
                                                            : "إعطاء درجة"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>{language === "En" ? "No data available" : "لا توجد بيانات متاحة"}</p>
                        )}
                    </div>
                </div>
            ) : (
                <ViewStudentExam studentId={studentId} examId={examId} language={language} setViewExamDetails={setViewExamDetails}/>
            ) }
        </div>
    );
}

export default StudentsExams;
