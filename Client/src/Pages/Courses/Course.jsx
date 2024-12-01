import "./Course.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import coursesApi from "../../api/coursesApi";

export default function Course() {
    const { isDarkMode, role } = useContext(UserContext);
    const [allCourses, setAllCourses] = useState([]);
    const navigate = useNavigate();
    const {userId} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(role, userId);
                const response = await coursesApi.fetchSomeCourses(role, userId);

                if (Array.isArray(response.data)) {
                    setAllCourses(response.data);
                } else {
                    console.error('Expected array but got:', response.data);
                }
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId, role]);

    const handleCourseClick = (courseCode) => {
        console.log(courseCode)
        navigate(`/ChapterUpload/${courseCode}/${userId}`); // Navigate to chapters page with course ID
    };

    return (
        <div className={`Course_coursesContainer ${isDarkMode ? "Course_dark" : ""}`}>
            <div className="Course_courses">
                {allCourses.length > 0 ? (
                    allCourses.map((item, index) => (
                        <div key={index} className={"Course_coursesCard"}
                             onClick={() => handleCourseClick(item.course_code)}>
                            <div className={"Course_content"}>
                                <div>
                                    <h3>{item.course_name}</h3>
                                </div>
                                <div className="Course_flex">
                                    <div>
                                        <h4>Level 2</h4>
                                    </div>
                                    <div className={"Course_price"}>
                                        <h3>{item.course_code}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No courses available</p>
                )}
            </div>
        </div>
    );
}