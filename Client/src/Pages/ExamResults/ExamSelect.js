

function ExamSelect({ exams, onSelect, language }) {
  return (
    <div>
      <h2>{language === 'En' ? 'Select Exam' : 'اختر الامتحان'}</h2>
      <select onChange={(e) => onSelect(e.target.value)} disabled={!exams.length}>
        <option value="">
            {language === 'En' ? '-- Select Exam --' : '-- اختر الامتحان --'}
        </option>
        {exams.map((exam) => (
          <option key={exam.examId} value={exam.examId}>
            {exam.examName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ExamSelect;
