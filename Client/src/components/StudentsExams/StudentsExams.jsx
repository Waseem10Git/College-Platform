import { useState, useContext } from "react";
import enrollmentsExamsApi from "../../api/enrollmentsExamsApi";
import { ViewStudentExam } from "../../Pages";
import UserContext from "../../context/UserContext"; // Assuming you have UserContext for dark mode
import "./StudentsExams.css";

function StudentsExams({
                           students,
                           examId,
                           language,
                           refreshData,
                           viewExamDetails,
                           setViewExamDetails,
                       }) {
    const [editingScore, setEditingScore] = useState(null);
    const [newScore, setNewScore] = useState("");
    const [studentId, setStudentId] = useState(null);
    const [studentScore, setStudentScore] = useState(null);
    const { isDarkMode } = useContext(UserContext); // Access dark mode from context

    const handleScoreChange = (e) => {
        setNewScore(e.target.value); // Update the score in the input
    };

    return (
        <div className={`StudentsExams_container ${isDarkMode ? "dark" : "light"}`}>
            {!viewExamDetails ? (
                <div>
                    <h2>{language === "En" ? "Student Results" : "نتائج الطلاب"}</h2>
                    <div>
                        {students.length > 0 ? (
                            <table
                                className={`StudentsExams_table ${
                                    isDarkMode ? "dark" : "light"
                                }`}
                            >
                                <thead>
                                <tr>
                                    <th>{language === "En" ? "ID" : "الرقم التعريفي"}</th>
                                    <th>{language === "En" ? "Student Name" : "اسم الطالب"}</th>
                                    <th>{language === "En" ? "Score" : "النتيجة"}</th>
                                    <th>{language === "En" ? "Submitted" : "تم"}</th>
                                    <th>
                                        {language === "En"
                                            ? "View / Edit Score"
                                            : "عرض / تعديل النتيجة"}
                                    </th>
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
                                                        language === "En" ? "Enter score" : "أدخل الدرجة"
                                                    }
                                                />
                                            ) : student.score != null && student.score >= 0 ? (
                                                student.score
                                            ) : (
                                                "--"
                                            )}
                                        </td>
                                        <td>{student.is_submitted ? "Yes" : "No"}</td>
                                        <td>
                                            {!editingScore && (
                                                <button
                                                    className={`submit-edit-button ${
                                                        isDarkMode ? "dark" : ""
                                                    }`}
                                                    onClick={() => {
                                                        setViewExamDetails(true);
                                                        setStudentId(student.student_id);
                                                        setStudentScore(student.score);
                                                    }}
                                                >
                                                    {language === "En" ? "View Exam" : "عرض الإمتحان"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>
                                {language === "En"
                                    ? "No data available"
                                    : "لا توجد بيانات متاحة"}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <ViewStudentExam
                    isDarkMode={isDarkMode}
                    studentId={studentId}
                    examId={examId}
                    language={language}
                    setViewExamDetails={setViewExamDetails}
                    refreshData={refreshData}
                    studentScore={studentScore}
                />
            )}
        </div>
    );
}

export default StudentsExams;
