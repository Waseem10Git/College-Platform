import {Link, useLocation} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import styles from '../NavBar/NavBar.module.css';
import UserContext from "../../context/UserContext";

function PagesLinks () {
    const { language, role, userId} = useContext(UserContext);
    const [pathName, setPathName] = useState("/");
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setPathName(location.pathname);
    }, [location])

    const hideHandle = (hoveredStateSetter, value) => {
        hoveredStateSetter(value);
    };

    return (
        <ul className={language === 'En' ? 'right-aligned' : 'left-aligned'}>
            <li className={pathName === "/" ? styles.active : ""}>
                <Link to="/">{language === 'En' ? 'Home' : 'الصفحة الرئيسية'}</Link>
            </li>
            {(role === "student" || role === "instructor") ? <>
                <li className={pathName === `/Course/${userId}` ? styles.active : ""}>
                    <Link to={`/Course/${userId}`}>{language === 'En' ? 'Course' : 'دورة'}</Link>
                </li>
            </> : null}
            {(role === "instructor") ? <>
                <li className={pathName === "/MakeExam" ? styles.active : ""}>
                    <Link to="/MakeExam">
                        {language === 'En' ? 'Make Exam' : 'عمل إمتحان'}
                    </Link>
                </li>
                <li className={pathName === "/ExamResults" ? styles.active : ""}>
                    <Link to="/ExamResults">
                        {language === 'En' ? 'Students/Results' : 'نتائج/الطلاب'}
                    </Link>
                </li>
                <li className={pathName === "/ExamPreview" ? styles.active : ""}>
                    <Link to="/ExamPreview">
                        {language === 'En' ? 'Exam Preview' : 'مراجعة الامتحان'}
                    </Link>
                </li>
                <li className={pathName === `/UploadAssignment` ? styles.active : ""}>
                    <Link to={`/UploadAssignment`}>{language === 'En' ? 'Upload Assignment' : 'دورة'}</Link>
                </li>
            </> : null}
            {(role === "student") ? <>
                <li className={pathName === "/TakeExam" ? styles.active : ""}>
                    <Link to="/TakeExam">{language === 'En' ? 'Take Exam' : 'امتحن'}</Link>
                </li>
                <li className={pathName === "/ExamResultDetails" ? styles.active : ""}>
                    <Link to="/ExamResultDetails">
                        {language === 'En' ? 'Exam Result' : 'نتيجة الامتحان'}
                    </Link>
                </li>
                <li className={pathName === `/Assignments` ? styles.active : ""}>
                    <Link to={`/Assignments`}>{language === 'En' ? 'Assignments' : 'دورة'}</Link>
                </li>
            </> : null}
            {(role === "admin") ? <>
                <li className={pathName === "/Accounts" ? styles.active : ""}>
                    <Link to="/Accounts">{language === 'En' ? 'Accounts Management' : 'ادارة الحسابات'}</Link>
                </li>
                <li className={pathName === "/AdminCourse" ? styles.active : ""}>
                    <Link to="/AdminCourse">{language === 'En' ? 'Structure Management' : 'ادارة الهيكل'}</Link>
                </li>
            </> : null}
        </ul>
    )
}

export default PagesLinks;