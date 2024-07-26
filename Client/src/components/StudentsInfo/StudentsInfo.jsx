
function StudentsInfo({ students, language }) {
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
                            <th>{language === 'En' ? 'Email' : 'الايميل'}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.id}</td>
                                <td>{`${student.first_name} ${student.last_name}`}</td>
                                <td>{student.email}</td>
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

export default StudentsInfo;
