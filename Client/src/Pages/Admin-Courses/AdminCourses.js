import {useState, useEffect, useContext} from 'react';
import './AdminCourses.css';
import DepartmentsView from './DepartmentsView'
import CoursesView from "./CoursesView";
import InstructorsView from "./InstructorsView";
import DepartmentsCoursesView from "./DepartmentsCoursesView";
import StudentsView from "./StudentsView";
import UserContext from "../../context/UserContext";
import departmentsApi from "../../api/departmentsApi";
import {SearchBar} from "../../components";

const AdminCourses = () => {
    const { isDarkMode, language } = useContext(UserContext);
    const [departments, setDepartments] = useState([]);
    const [selectedView, setSelectedView] = useState('');
    const [viewSearchText, setViewSearchText] = useState("");
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
                <button
                    onClick={() => {
                        setSelectedView("departments");
                        setViewSearchText(
                            language === "En"
                                ? "Search by Department name"
                                : "البحث بإسم القسم"
                        );
                    }}
                    className="AdminCourses_view-button"
                >
                    {language === "En" ? "Add Departments" : "إضافة الأقسام"}
                </button>
                <button
                    onClick={() =>  {
                        setSelectedView("courses");
                        setViewSearchText(
                            language === "En" ? "Search by course name" : "البحث بإسم المادة"
                        );
                    }}
                    className="AdminCourses_view-button"
                >
                    {language === "En" ? "Add Courses" : "إضافة الدورات"}
                </button>
                <button
                    onClick={() =>  {
                        setSelectedView("departments-courses");
                        setViewSearchText(
                            language === "En"
                                ? "Search by department name or course name"
                                : "البحث بإسم القسم او بإسم المادة"
                        );
                    }}
                    className="AdminCourses_view-button"
                >
                    {language === "En"
                        ? "Add Courses to Departments"
                        : "إضافة الدورات الى الأقسام"}
                </button>
                <button
                    onClick={() =>  {
                        setSelectedView("instructors");
                        setViewSearchText(
                            language === "En"
                                ? "Search by instructor name"
                                : "البحث بإسم المدرس"
                        );
                    }}
                    className="AdminCourses_view-button"
                >
                    {language === "En"
                        ? "Add Instructors to Courses"
                        : "إضافة المدربين الى الدورات"}
                </button>
                <button
                    onClick={() =>  {
                        setSelectedView("students");
                        setViewSearchText(
                            language === "En"
                                ? "Search by students name"
                                : "البحث بإسم الطالب"
                        );
                    }}
                    className="AdminCourses_view-button"
                >
                    {language === "En"
                        ? "Add Students to Courses"
                        : "إضافة الطلاب الى الدورات"}
                </button>
            </div>
            <dev>
                <SearchBar searchText={viewSearchText}/>
            </dev>
            {selectedView ? renderView() : null}

        </div>
    );
};
export default AdminCourses;