
function StudentResults({ students, language }) {
  return (
    <div>
      <h2>{language === 'En' ? 'Student Results' : 'نتائج الطلاب'}</h2>
      {students.length === 0 ? (
        <p className="no-results">{language === 'En' ? 'No results found.' : 'لم يتم العثور على نتائج.'}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{language === 'En' ? 'Name' : 'الاسم'}</th>
              <th>{language === 'En' ? 'Score' : 'الدرجة'}</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentName}</td>
                <td>{student.score === null ? "--" : student.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentResults;
