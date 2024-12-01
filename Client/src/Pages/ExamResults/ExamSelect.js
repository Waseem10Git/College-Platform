import {useContext} from "react";
import UserContext from "../../context/UserContext";
import './ExamSelect.css';

function ExamSelect({ exams, onSelect }) {
    const { language, isDarkMode } = useContext(UserContext);
  return (
      <div className={`ExamSelect_container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <h3 className={isDarkMode ? 'dark-text' : 'light-text'}>
              {language === 'En' ? 'Select Exam' : 'اختر الامتحان'}
          </h3>
          <select
              onChange={(e) => onSelect(parseInt(e.target.value))}
              disabled={!exams.length}
              className={`ExamSelect_dropdown ${isDarkMode ? 'dark' : 'light'}`}
          >
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
