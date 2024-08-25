import {useNavigate} from "react-router-dom";

function StudentsExams({ students, examId, language }) {
    const navigate = useNavigate();
    return (
        <div>
            <h2>{language === 'En' ? 'Student Results' : 'نتائج الطلاب'}</h2>
            <div>
                {students.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>{language === 'En' ? 'ID' : 'الرقم التعريفي'}</th>
                            <th>{language === 'En' ? 'Student Name' : 'اسم الطالب'}</th>
                            <th>{language === 'En' ? 'Score' : 'النتيجة'}</th>
                            <th>{language === 'En' ? 'Submitted' : 'تم'}</th>
                            <th>{language === 'En' ? 'View / Edit Score' : 'عرض / تعديل النتيجة'}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.id}</td>
                                <td>{`${student.first_name} ${student.last_name}`}</td>
                                <td>{student.score ? student.score : '--'}</td>
                                <td>{student.is_submitted ? 'Yes' : 'No'}</td>
                                <td>
                                    <button className={"submit-edit-button"} onClick={() => {navigate(`/StudentExam/${student.id}/${examId}`)}}>
                                        {language === 'En' ? 'Exam' : 'الامتحان'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>{language === 'En' ? 'No data available' : 'لا توجد بيانات متاحة'}</p>
                )}
            </div>
        </div>
    );
}

export default StudentsExams;
