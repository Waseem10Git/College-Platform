import {useNavigate} from "react-router-dom";

function StudentsAssignments({ students, assignmentId, language }) {
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
                            <th>{language === 'En' ? 'Assignment Uploaded' : 'التكيلف المرفوع'}</th>
                            <th>{language === 'En' ? 'Score' : 'النتيجة'}</th>
                            <th>{language === 'En' ? 'Uploaded At' : 'وقت الرفع'}</th>
                            <th>{language === 'En' ? 'View / Edit Score' : 'عرض / تعديل النتيجة'}</th>{/*tack me to new page inside it view and handle score*/}
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.id}</td>
                                <td>{`${student.first_name} ${student.last_name}`}</td>
                                <td>{student.assignment_file_name ? 'Submitted' : 'Not Submitted'}</td>
                                <td>{student.score ? student.score : '--'}</td>
                                <td>{student.uploaded_at ? student.uploaded_at : '--'}</td>
                                <td>
                                    <button className={"submit-edit-button"} onClick={() => {navigate(`/StudentAssignment/${student.id}/${assignmentId}`)}}>
                                        {language === 'En' ? 'Assignment' : 'التكليف'}
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

export default StudentsAssignments;
