import "./Course.css";
import {Link, useNavigate, useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import phoneIcon from "../Chapters/Imgs/phone-icon.png";
import mailIcon from "../Chapters/Imgs/mail-icon.png";
import dollarIcon from "../Chapters/Imgs/dollar-sign.png";
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
                    response = await axios.get(`/api/student/${userId}/courses`);
                } else if (Role === 'instructor') {
                    response = await axios.get(`/api/instructor/${userId}/courses`);
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
        navigate(`/ChapterUpload/${courseCode}`); // Navigate to chapters page with course ID
    };

    return (
        <div className={`courses-container ${isDarkMode && "dark"}`}>
            <div className="courses">
                {allCourses.length > 0 ? (
                    allCourses.map((item, index) => (
                        <div key={index} className="courses-card"
                             onClick={() => handleCourseClick(item.course_code)}>
                            <div className="image">
                                <img src={item.imgUrl} alt={item.course_name}/>
                            </div>
                            <div className="content">
                                <div className="flex">
                                    <div>
                                        <h3>{item.course_name}</h3>
                                        <h4>{item.first_name + " " + item.last_name}</h4>
                                    </div>
                                    <div className="price">
                                        {/*<img src={dollarIcon} alt="Dollar Icon"/>*/}
                                        <h3>{item.course_code} EPL</h3>
                                    </div>
                                </div>
                                <div className="info-group">
                                    {/*<img src={phoneIcon} alt="Phone Icon"/>*/}
                                    <p>{item.phone}</p>
                                </div>
                                <div className="info-group">
                                    {/*<img src={mailIcon} alt="Mail Icon"/>*/}
                                    <p>{item.email}</p>
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