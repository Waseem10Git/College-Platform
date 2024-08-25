import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

function PagesLinks ({ language, Role, relative, fixed, userId }) {
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
            <li className={pathName === "/" ? "active" : ""}>
                <Link to="/" onClick={relative}>{language === 'En' ? 'Home' : 'الصفحة الرئيسية'}</Link>
            </li>
            {(Role === "student" || Role === "instructor") ? <>
                <li className={pathName === `/Course/${userId}` ? "active" : ""}>
                    <Link to={`/Course/${userId}`} onClick={fixed}>{language === 'En' ? 'Course' : 'دورة'}</Link>
                </li>
            </> : null}
            {(Role === "instructor") ? <>
                <li className="dropdown-container"
                    onMouseEnter={() => hideHandle(setIsHovered, true)}
                    onMouseLeave={() => hideHandle(setIsHovered, false)}>
                    <Link to="#" className={pathName.includes("Exam") ? "active" : ""}>
                        {language === 'En' ? 'Exam' : 'إختبارات'}
                    </Link>
                    {isHovered && (
                        <ul className="dropdown-content">
                            <li className={pathName === "/MakeExam" ? "active" : ""}>
                                <Link to="/MakeExam">
                                    {language === 'En' ? 'Make Exam' : 'عمل إمتحان'}
                                </Link>
                            </li>
                            <li className={pathName === "/ExamResults" ? "active" : ""}>
                                <Link to="/ExamResults" onClick={relative}>
                                    {language === 'En' ? 'Exam Results' : 'نتائج الإمتحانات'}
                                </Link>
                            </li>
                            <li className={pathName === "/ExamPreview" ? "active" : ""}>
                                <Link to="/ExamPreview" onClick={relative}>
                                    {language === 'En' ? 'Exam Preview' : 'مراجعة الامتحان'}
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className={pathName === `/UploadAssignment` ? "active" : ""}>
                    <Link to={`/UploadAssignment`}
                          onClick={fixed}>{language === 'En' ? 'Upload Assignment' : 'دورة'}</Link>
                </li>
            </> : null}
            {(Role === "student") ? <>
                <li className={pathName === "/TakeExam" ? "active" : ""}>
                    <Link to="/TakeExam" onClick={fixed}>{language === 'En' ? 'Take Exam' : 'امتحن'}</Link>
                </li>
                <li className={pathName === "/ExamResultDetails" ? "active" : ""}>
                    <Link to="/ExamResultDetails" onClick={relative}>
                        {language === 'En' ? 'Exam Result' : 'نتيجة الامتحان'}
                    </Link>
                </li>
                <li className={pathName === `/Assignments` ? "active" : ""}>
                    <Link to={`/Assignments`} onClick={fixed}>{language === 'En' ? 'Assignments' : 'دورة'}</Link>
                </li>
            </> : null}
            {(Role === "admin") ? <>
                <li className={pathName === "/Accounts" ? "active" : ""}>
                    <Link to="/Accounts">{language === 'En' ? 'Accounts Management' : 'ادارة الحسابات'}</Link>
                </li>
                <li className={pathName === "/AdminCourse" ? "active" : ""}>
                    <Link to="/AdminCourse"
                          onClick={fixed}>{language === 'En' ? 'Structure Management' : 'ادارة الهيكل'}</Link>
                </li>
                <li className={pathName === "/Dashboard" ? "active" : ""}>
                    <Link to="/Dashboard" onClick={fixed}>{language === 'En' ? 'Dashboard' : 'لوحات المعلومات'}</Link>
                </li>
            </> : null}
        </ul>
    )
}

export default PagesLinks;