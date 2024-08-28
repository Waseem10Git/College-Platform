import "./Course.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from '../../api/axios';

export default function Course({ isDarkMode, Role  }) {
    const [allCourses, setAllCourses] = useState([]);
    const navigate = useNavigate();
    const {userId} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("userId: ", userId)
                console.log("Role: ",Role)
                let response;
                if (Role === 'student') {
                    response = await axios.get(`/api/student/${userId}/courses`, {responseType: "json"});
                } else if (Role === 'instructor') {
                    response = await axios.get(`/api/instructor/${userId}/courses`, {responseType: "json"});
                }
                console.log('API response:', response.data); // Log the response
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
    }, [userId, Role]);

    const handleCourseClick = (courseCode) => {
        console.log(courseCode)
        navigate(`/ChapterUpload/${courseCode}/${userId}`); // Navigate to chapters page with course ID
    };

    return (
        <div className={`courses-container ${isDarkMode && "dark"}`}>
            <div className="courses">
                {allCourses.length > 0 ? (
                    allCourses.map((item, index) => (
                        <div key={index} className="courses-card"
                             onClick={() => handleCourseClick(item.course_code)}>
                            <div className="image">
                                <img src={`data:image/jpeg;base64,${item.image}`} alt={item.course_name}/>
                            </div>
                            <div className="content">
                                <div className={"course-name"}>
                                    <h3>{item.course_name}</h3>
                                </div>
                                <div className="flex">
                                    <div>
                                        <h4>Level 2</h4>
                                    </div>
                                    <div className="price">
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