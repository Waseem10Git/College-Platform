

function CourseSelect({ courses, onSelect, language }) {
  return (
    <div>
      <h2>{language === 'En' ? 'Select Course' : 'اختر الدورة'}</h2>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">
            {language === 'En' ? '-- Select Course --' : '-- اختر الدورة --'}
        </option>
        {courses.map((course, index) => (
          <option key={index} value={course.course_code}>
            {course.course_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CourseSelect;
