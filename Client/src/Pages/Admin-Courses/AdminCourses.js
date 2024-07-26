import { useState, useEffect } from 'react';
import './AdminCourses.css';
import axios from "axios";
import DepartmentsView from './DepartmentsView'
import CoursesView from "./CoursesView";
import InstructorsView from "./InstructorsView";
import DepartmentsCoursesView from "./DepartmentsCoursesView";
import StudentsView from "./StudentsView";

const AdminCourses = ({ isDarkMode, language }) => {
    const [departments, setDepartments] = useState([]);
    const [selectedView, setSelectedView] = useState('');

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:4001/api/departments');
            setDepartments(response.data);
        }catch (err) {
            console.log("Error fetching departments data: ", err);
        }
    }
    useEffect(() => {
        fetchDepartments();
    }, []);

    const renderView = () => {
        switch (selectedView) {
            case 'departments':
                return <DepartmentsView isDarkMode={isDarkMode} language={language}/>;
            case 'courses':
                return <CoursesView language={language} departments={departments}/>;
            case 'departments-courses':
                return <DepartmentsCoursesView language={language} departments={departments}/>
            case 'instructors':
                return <InstructorsView language={language} />;
            case 'students':
                return <StudentsView language={language} />;
            default:
                return null;
        }
    };

    return (
        <div className={`courses-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="view-buttons">
                <button onClick={() => setSelectedView('departments')}
                        className="view-button">{language === 'En' ? 'Add Departments' : 'إضافة الأقسام'}</button>
                <button onClick={() => setSelectedView('courses')}
                        className="view-button">{language === 'En' ? 'Add Courses' : 'إضافة الدورات'}</button>
                <button onClick={() => setSelectedView('departments-courses')}
                        className="view-button">{language === 'En' ? 'Add Courses to Departments' : 'إضافة الدورات الى الأقسام'}</button>
                <button onClick={() => setSelectedView('instructors')}
                        className="view-button">{language === 'En' ? 'Add Instructors to Courses' : 'إضافة المدربين الى الدورات'}</button>
                <button onClick={() => setSelectedView('students')}
                        className="view-button">{language === 'En' ? 'Add Students to Courses' : 'إضافة الطلاب الى الدورات'}</button>
            </div>

            {selectedView ? renderView() : null}

        </div>
    );
};
export default AdminCourses;