import {useContext} from "react";
import UserContext from "../../context/UserContext";
import './CourseSelect.css';


function CourseSelect({ courses, onSelect }) {
    const { language, isDarkMode } = useContext(UserContext);
  return (
      <div className={`CourseSelect_container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <h3>{language === 'En' ? 'Select Course' : 'اختر المادة'}</h3>
          <select onChange={(e) => onSelect(e.target.value)} className="courseSelect_dropdown">
              <option value="">{language === 'En' ? '-- Select Course --' : '-- اختر المادة --'}</option>
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
