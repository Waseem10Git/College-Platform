import { useEffect, useState } from "react";
import phoneIcon from "./Imgs/phone-icon.png";
import mailIcon from "./Imgs/mail-icon.png";
import dollarIcon from "./Imgs/dollar-sign.png";
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

export default function Chapters({ isDarkMode }) {
    const [allCourses, setAllCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/instructor-courses");
                setAllCourses(response.data);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleCourseClick = (courseId) => {
        navigate(`/chapters/${courseId}`);
    };

    return (
        <div className={`courses-container ${isDarkMode && "dark"}`}>
            <div className="courses">
                {allCourses.map((item, index) => (
                    <div key={index} className="courses-card" onClick={() => handleCourseClick(item.id)}>
                        <div className="image">
                            <img src={item.imgUrl} alt={item.course_name} />
                        </div>
                        <div className="content">
                            <div className="flex">
                                <div>
                                    <h3>{item.course_name}</h3>
                                    <h4>{item.first_name + " " + item.last_name}</h4>
                                </div>
                                <div className="price">
                                    <img src={dollarIcon} alt="Dollar Icon" />
                                    <h3>{item.course_code} EPL</h3>
                                </div>
                            </div>
                            <div className="info-group">
                                <img src={phoneIcon} alt="Phone Icon" />
                                <p>{item.phone}</p>
                            </div>
                            <div className="info-group">
                                <img src={mailIcon} alt="Mail Icon" />
                                <p>{item.email}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
