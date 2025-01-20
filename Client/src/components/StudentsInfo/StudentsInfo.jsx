import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import "./StudentsInfo.css";
import enrollmentsApi from "../../api/enrollmentsApi";

function StudentsInfo({ selectedCourse, userId, language }) {
    const { isDarkMode } = useContext(UserContext); // Get dark mode from context
    const [studentInfo, setStudentInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchStudentInfo = async () => {
        setIsLoading(true);
        await enrollmentsApi.fetchStudentsEnrolledInCourse(selectedCourse, userId)
            .then(response => {
                setIsLoading(false);
                setStudentInfo(response.data);
            })
            .catch(error => {
                setIsLoading(false);
                console.error("Error fetching enrollments:", error);
            });
    };

    const parseScores = (scoresString, type) => {
        return scoresString.split(";").map((entry, index) => {
            const match = entry.match(/(Exam|Assignment): ([^()]+) \(Score: ([^)]+)\)/);
            return match
                ? { name: match[2], score: match[3] }
                : { name: `${type}-${index + 1}`, score: "N/A" };
        });
    };

    useEffect(() => {
        fetchStudentInfo();
    }, []);

    return (
        <div className={`StudentsInfo_container ${isDarkMode ? "dark" : "light"}`}>
            <h2>{language === "En" ? "Student Results" : "نتائج الطلاب"}</h2>
            <div>
                {studentInfo.length > 0 ? (
                    <table
                        className={`StudentsInfo_table ${isDarkMode ? "dark" : "light"}`}
                        style={language === 'En' ? {textAlign: "left"} : {textAlign:'right'}}
                    >
                        <thead>
                        <tr>
                            <th>{language === "En" ? "ID" : "الرقم التعريفي"}</th>
                            <th>{language === "En" ? "Student Name" : "اسم الطالب"}</th>
                            <th>{language === "En" ? "Exams" : "الامتحانات"}</th>
                            <th>{language === "En" ? "Assignments" : "المهام"}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {studentInfo.map((student, index) => {
                            const exams = parseScores(student.exam_scores, "Exam");
                            const assignments = parseScores(student.assignment_scores, "Assignment");

                            return (
                                <tr key={index}>
                                    <td>{student.student_id}</td>
                                    <td>{`${student.first_name} ${student.last_name}`}</td>
                                    <td>
                                        {exams.map((exam, i) => (
                                            <div key={`exam-${i}`}>
                                                <p className={'StudentsInfo_scores'}>
                                                    {`${exam.name}: ${exam.score}`}
                                                </p>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {assignments.map((assignment, i) => (
                                            <div key={`assignment-${i}`}>
                                                <p className={'StudentsInfo_scores'}>
                                                    {`${assignment.name}: ${assignment.score}`}
                                                </p>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : (
                    <>
                        {isLoading ? (
                            <p className="no-data-message">
                                {language === "En" ? "Loading..." : "جاري التحميل..."}
                            </p>
                        ) : (
                            <p className="no-data-message">
                                {language === "En" ? "No data available" : "لا توجد بيانات متاحة"}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentsInfo;
