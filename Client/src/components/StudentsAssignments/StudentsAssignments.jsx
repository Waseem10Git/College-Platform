import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import "./StudentsAssignments.css";
import assignmentsApi from "../../api/assignmentsApi";
import { toast } from "react-toastify";
import {AiFillCheckSquare, AiFillCloseSquare} from "react-icons/ai";

function StudentsAssignments({ students, assignmentScore, refreshData }) {
    const { isDarkMode, language } = useContext(UserContext);
    const [fileView, setFileView] = useState(null);
    const [editingScore, setEditingScore] = useState(null);
    const [newScore, setNewScore] = useState(0);
    const [inputError, setInputError] = useState({EnMessage: '', ArMessage: ''});

    const handleView = (studentAssignmentId) => {
        try {
            const url = assignmentsApi.viewAssignment(studentAssignmentId);
            window.open(url, "_blank");
            // setFileView({ url });
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
        const value = parseInt(e.target.value);

        if (isNaN(value) || value < 0 || value > assignmentScore) {
            setInputError({
                EnMessage: "Points must be between 0 and the maximum question points",
                ArMessage: "يجب أن تكون النقاط بين 0 والحد الأقصى لنقاط السؤال"
            })
        } else {
            setInputError({EnMessage: '', ArMessage: ''});
            setNewScore(value);
        }
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
            <div style={{margin: '10px 20px'}}>
                {students.length > 0 ? (
                    <table
                        className={`StudentsAssignments_table ${
                            isDarkMode ? "dark" : "light"
                        }`}
                        style={language === 'En' ? {textAlign: "left"} : {textAlign:'right'}}
                    >
                        <thead>
                        <tr>
                            <th>{language === "En" ? "ID" : "الرقم التعريفي"}</th>
                            <th>{language === "En" ? "Student Name" : "اسم الطالب"}</th>
                            <th>{language === "En" ? "Score" : "النتيجة"}</th>
                            <th>
                                {language === "En"
                                    ? "Uploaded"
                                    : "تم الرفع"}
                            </th>
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
                                    {editingScore === student.student_assignment_id ? (
                                        <>
                                            {inputError && (
                                                <p style={{color: 'red', marginBottom: '8px', fontStyle: 'italic'}}>
                                                    {language === 'En' ? inputError.EnMessage : inputError.ArMessage}
                                                </p>
                                            )}
                                            <input
                                                type="number"
                                                value={newScore}
                                                onChange={(e) => handleScoreChange(e)}
                                                placeholder={
                                                    language === "En" ? "Enter score" : "أدخل الدرجة"
                                                }
                                            />
                                        </>
                                    ) : student.score != null && student.score >= 0 ? (
                                        `${student.score} / ${assignmentScore}`
                                    ) : (
                                        `-- / ${assignmentScore}`
                                    )}
                                </td>
                                <td>
                                    {student.submitted_file_name ? (
                                        <p className={'StudentsAssignments_trueFalse'} style={{color: 'green'}}>
                                            <span className={'StudentsAssignments_trueFalse-icon'}>
                                                <AiFillCheckSquare/>
                                            </span>
                                            <span className={'StudentsAssignments_trueFalse-behind'}
                                                  style={language === 'En' ? {left: '5px'} : {right: '5px'}}/>
                                        </p>
                                    ) : (
                                        <p className={'StudentsAssignments_trueFalse'} style={{color: 'red'}}>
                                            <span className={'StudentsAssignments_trueFalse-icon'}>
                                                <AiFillCloseSquare/>
                                            </span>
                                            <span className={'StudentsAssignments_trueFalse-behind'}
                                                  style={language === 'En' ? {left: '5px'} : {right: '5px'}}/>
                                        </p>
                                    )}
                                </td>
                                <td>
                                    {student.submission_date
                                        ? formatDate(student.submission_date)
                                        : "--"}
                                </td>
                                <td>
                                    {!editingScore && student.student_file_path && (
                                        <button
                                            className={`StudentsAssignments_submit-edit-button ${
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
                                                className={`StudentsAssignments_submit-edit-button ${
                                                    isDarkMode ? "dark" : ""
                                                }`}
                                                onClick={() =>
                                                    saveScore(student.student_assignment_id)
                                                }
                                            >
                                                {language === "En" ? "Save" : "حفظ"}
                                            </button>
                                            <button
                                                id={'StudentsAssignments_red-button'}
                                                className={`StudentsAssignments_submit-edit-button ${
                                                    isDarkMode ? "dark" : ""
                                                }`}
                                                onClick={() => setEditingScore(null)}
                                            >
                                                {language === "En" ? "Cancel" : "إلغاء"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            id={'StudentsAssignments_orange-button'}
                                            className={`StudentsAssignments_submit-edit-button ${
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
