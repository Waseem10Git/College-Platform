import {useState, useEffect, useContext} from 'react';
import './AdminCourses.css';
import DepartmentsView from './DepartmentsView'
import CoursesView from "./CoursesView";
import InstructorsView from "./InstructorsView";
import DepartmentsCoursesView from "./DepartmentsCoursesView";
import StudentsView from "./StudentsView";
import DeleteData from "./DeleteData";
import UserContext from "../../context/UserContext";
import departmentsApi from "../../api/departmentsApi";
import {toast} from "react-toastify";

const AdminCourses = () => {
    const { isDarkMode, language } = useContext(UserContext);
    const [departments, setDepartments] = useState([]);
    const [selectedView, setSelectedView] = useState('');
    const fetchDepartments = async () => {
        try {
            const response = await departmentsApi.fetchDepartment();
            setDepartments(response.data);
        }catch (err) {
            toast.error(language === 'En' ? 'Error fetching departments data' : 'خطأ في جلب الأقسام')
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
            case 'delete-data':
                return <DeleteData/>;
            default:
                return null;
        }
    };

    return (
        <div className={`AdminCourses_courses-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="AdminCourses_view-buttons">
                <button
                    onClick={() => setSelectedView("departments")}
                    className="AdminCourses_view-button"
                >
                    {language === "En" ? "Add Departments" : "إضافة الأقسام"}
                </button>
                <button
                    onClick={() => setSelectedView("courses")}
                    className="AdminCourses_view-button"
                >
                    {language === "En" ? "Add Courses" : "إضافة المواد"}
                </button>
                <button
                    onClick={() => setSelectedView("departments-courses")}
                    className="AdminCourses_view-button"
                >
                    {language === "En"
                        ? "Add Courses to Departments"
                        : "إضافة المواد الى الأقسام"}
                </button>
                <button
                    onClick={() => setSelectedView("instructors")}
                    className="AdminCourses_view-button"
                >
                    {language === "En"
                        ? "Add Instructors to Courses"
                        : "إضافة المدرسين الى المواد"}
                </button>
                <button
                    onClick={() => setSelectedView("students")}
                    className="AdminCourses_view-button"
                >
                    {language === "En"
                        ? "Add Students to Courses"
                        : "إضافة الطلاب الى المواد"}
                </button>
                <button
                    onClick={() => setSelectedView("delete-data")}
                    className="AdminCourses_view-button"
                >
                    {language === "En"
                        ? "Delete Tables Data"
                        : "حذف بيانات الجداول"}
                </button>
            </div>
            {selectedView ? renderView() : null}

        </div>
    );
};
export default AdminCourses;