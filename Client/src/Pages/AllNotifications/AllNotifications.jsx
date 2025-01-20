import React, {useContext, useEffect, useState} from 'react';
import axios from '../../api/axios';
import "./AllNotificaions.css";
import UserContext from "../../context/UserContext";

function AllNotifications() {
    const { userId, language, isDarkMode } = useContext(UserContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/api/notifications/${userId}`);
                if (response.data) {
                    const formattedNotifications = response.data.map(notif => ({
                        ...notif,
                        created_at: new Date(notif.created_at)
                    })).sort((a, b) => b.created_at - a.created_at);
                    setNotifications(formattedNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const intervalId = setInterval(fetchNotifications, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [userId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours()); // Adjusting the time zone if needed
        return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className={`notifications ${isDarkMode ? 'dark' : ''}`}>
            <h1>{language === 'En' ? 'All Notifications' : 'كل الإشعارات'}</h1>
            <ul className={"list-notifications"}>
                {notifications.map((notif, index) => (
                    <li key={index} className={"item"}>
                        <div className={"notification-content"}>
                            <p className={"message"}>{notif.message}</p>
                            <p className={"date"}>{formatDate(notif.created_at)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AllNotifications;