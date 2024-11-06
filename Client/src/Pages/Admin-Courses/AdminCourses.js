import {useState, useEffect, useContext} from 'react';
import './AdminCourses.css';
import DepartmentsView from './DepartmentsView'
import CoursesView from "./CoursesView";
import InstructorsView from "./InstructorsView";
import DepartmentsCoursesView from "./DepartmentsCoursesView";
import StudentsView from "./StudentsView";
import UserContext from "../../context/UserContext";
import departmentsApi from "../../api/departmentsApi";

const AdminCourses = () => {
    const { isDarkMode, language } = useContext(UserContext);
    const [departments, setDepartments] = useState([]);
    const [selectedView, setSelectedView] = useState('');

    const fetchDepartments = async () => {
        try {
            const response = await departmentsApi.fetchDepartment();
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
                return <DepartmentsView departments={departments} fetchDepartments={fetchDepartments}/>;
            case 'courses':
                return <CoursesView/>;
            case 'departments-courses':
                return <DepartmentsCoursesView departments={departments} fetchDepartments={fetchDepartments}/>
            case 'instructors':
                return <InstructorsView/>;
            case 'students':
                return <StudentsView/>;
            default:
                return null;
        }
    };

    return (
        <div className={`AdminCourses_courses-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="AdminCourses_view-buttons">
                <button onClick={() => setSelectedView('departments')}
                        className="AdminCourses_view-button">{language === 'En' ? 'Add Departments' : 'إضافة الأقسام'}</button>
                <button onClick={() => setSelectedView('courses')}
                        className="AdminCourses_view-button">{language === 'En' ? 'Add Courses' : 'إضافة الدورات'}</button>
                <button onClick={() => setSelectedView('departments-courses')}
                        className="AdminCourses_view-button">{language === 'En' ? 'Add Courses to Departments' : 'إضافة الدورات الى الأقسام'}</button>
                <button onClick={() => setSelectedView('instructors')}
                        className="AdminCourses_view-button">{language === 'En' ? 'Add Instructors to Courses' : 'إضافة المدربين الى الدورات'}</button>
                <button onClick={() => setSelectedView('students')}
                        className="AdminCourses_view-button">{language === 'En' ? 'Add Students to Courses' : 'إضافة الطلاب الى الدورات'}</button>
            </div>

            {selectedView ? renderView() : null}

        </div>
    );
};
export default AdminCourses;