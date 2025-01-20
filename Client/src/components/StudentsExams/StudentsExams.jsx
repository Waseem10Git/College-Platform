import { useState, useContext } from "react";
import { ViewStudentExam } from "../../Pages";
import UserContext from "../../context/UserContext";
import "./StudentsExams.css";

function StudentsExams({students, examId, language, refreshData, viewExamDetails, setViewExamDetails,}) {
    const [studentId, setStudentId] = useState(null);
    const [studentScore, setStudentScore] = useState(null);
    const { isDarkMode } = useContext(UserContext); // Access dark mode from context

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
                                style={language === 'En' ? {textAlign: "left"} : {textAlign:'right'}}
                            >
                                <thead>
                                <tr>
                                    <th>{language === "En" ? "ID" : "الرقم التعريفي"}</th>
                                    <th>{language === "En" ? "Student Name" : "اسم الطالب"}</th>
                                    <th>{language === "En" ? "Score" : "النتيجة"}</th>
                                    <th>{language === "En" ? "Submitted" : "أتم الإمتحان"}</th>
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
                                            {student.score != null && student.score >= 0 ? (
                                                student.score
                                            ) : (
                                                "--"
                                            )}
                                        </td>
                                        <td>{student.is_submitted ? "Yes" : "No"}</td>
                                        <td>
                                            <button
                                                className={`StudentsExams_submit-edit-button ${
                                                    isDarkMode ? "dark" : ""
                                                }`}
                                                onClick={() => {
                                                    setViewExamDetails(true);
                                                    setStudentId(student.student_id);
                                                    setStudentScore(student.score);
                                                }}
                                                disabled={!student.is_submitted}
                                            >
                                                {language === "En" ? "View Exam" : "عرض الإمتحان"}
                                            </button>
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
