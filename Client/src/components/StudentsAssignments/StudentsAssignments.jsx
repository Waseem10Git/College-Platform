import { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import "./StudentsAssignments.css";
import assignmentsApi from "../../api/assignmentsApi";
import { toast } from "react-toastify";

function StudentsAssignments({ students, refreshData }) {
    const { isDarkMode, language } = useContext(UserContext);
    const [fileView, setFileView] = useState(null);
    const [editingScore, setEditingScore] = useState(null);
    const [newScore, setNewScore] = useState(0);
    console.log(students);
    const handleView = async (studentAssignmentId) => {
        try {
            const response = await assignmentsApi.viewAssignment(studentAssignmentId);
            const contentType = response.headers["content-type"];
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: contentType })
            );
            setFileView({ url, contentType });
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                toast.error(error.response.data.message);
            } else {
                toast.error(
                    language === "En" ? "Error viewing assignment" : "خطأ في عرض التكليف"
                );
            }
        }
    };

    const handleEditClick = (studentId, currentScore) => {
        setEditingScore(studentId);
        setNewScore(currentScore || 0);
    };

    const handleScoreChange = (e) => {
        setNewScore(parseInt(e.target.value));
    };

    const saveScore = async (studentAssignmentId) => {
        try {
            await assignmentsApi.editStudentAssignmentScore(
                studentAssignmentId,
                newScore
            );
            refreshData();
            setEditingScore(null);
        } catch (error) {
            toast.error(
                language === "En" ? "Error updating score" : "خطأ في تحديث النتيجة"
            );
        }
    };

    const formatDate = (date) => {
        const formatedDate = new Date(date);
        return formatedDate.toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div
            className={`StudentsAssignments_container ${
                isDarkMode ? "dark" : "light"
            }`}
        >
            <h2>{language === "En" ? "Student Results" : "نتائج الطلاب"}</h2>
            <div>
                {students.length > 0 ? (
                    <table
                        className={`StudentsAssignments_table ${
                            isDarkMode ? "dark" : "light"
                        }`}
                    >
                        <thead>
                        <tr>
                            <th>{language === "En" ? "ID" : "الرقم التعريفي"}</th>
                            <th>{language === "En" ? "Student Name" : "اسم الطالب"}</th>
                            <th>
                                {language === "En"
                                    ? "Assignment Uploaded"
                                    : "التكيلف المرفوع"}
                            </th>
                            <th>{language === "En" ? "Score" : "النتيجة"}</th>
                            <th>{language === "En" ? "Uploaded At" : "وقت الرفع"}</th>
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
                                    {student.submitted_file_name
                                        ? language === "En"
                                            ? "Submitted"
                                            : "تم التسليم"
                                        : language === "En"
                                            ? "Not Submitted"
                                            : "لم ينم التسليم"}
                                </td>
                                <td>
                                    {editingScore === student.student_assignment_id ? (
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
                                <td>
                                    {student.submission_date
                                        ? formatDate(student.submission_date)
                                        : "--"}
                                </td>
                                <td>
                                    {!editingScore && student.student_file && (
                                        <button
                                            className={`submit-edit-button ${
                                                isDarkMode ? "dark" : ""
                                            }`}
                                            onClick={() =>
                                                handleView(student.student_assignment_id)
                                            }
                                        >
                                            {language === "En" ? "View" : "عرض"}
                                        </button>
                                    )}
                                    {editingScore === student.student_assignment_id ? (
                                        <>
                                            <button
                                                className={`submit-edit-button ${
                                                    isDarkMode ? "dark" : ""
                                                }`}
                                                onClick={() =>
                                                    saveScore(student.student_assignment_id)
                                                }
                                            >
                                                {language === "En" ? "Save" : "حفظ"}
                                            </button>
                                            <button
                                                className={`submit-edit-button ${
                                                    isDarkMode ? "dark" : ""
                                                }`}
                                                onClick={() => setEditingScore(null)}
                                            >
                                                {language === "En" ? "Cancel" : "إلغاء"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className={`submit-edit-button ${
                                                isDarkMode ? "dark" : ""
                                            }`}
                                            onClick={() =>
                                                handleEditClick(
                                                    student.student_assignment_id,
                                                    student.score
                                                )
                                            }
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
                    <p>
                        {language === "En" ? "No data available" : "لا توجد بيانات متاحة"}
                    </p>
                )}

                {fileView && (
                    <div
                        className={`StudentsAssignments_overlay-background ${
                            isDarkMode ? "dark" : ""
                        }`}
                        onClick={() => setFileView(null)}
                    ></div>
                )}
                {fileView && (
                    <div
                        className={`StudentsAssignments_overlay ${
                            isDarkMode ? "dark" : ""
                        }`}
                    >
                        <div className="StudentsAssignments_overlay-content">
                            <h3>{language === "En" ? "File preview" : "عرض الملف"}</h3>
                            <embed
                                src={fileView.url}
                                type="application/pdf"
                                width="100%"
                                height="600px"
                            />
                            <button onClick={() => setFileView(null)}>
                                {language === "En" ? "Close Preview" : "إغلاق الملف"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentsAssignments;
