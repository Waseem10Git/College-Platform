import React, {useEffect, useState} from 'react';
import axios from '../../api/axios';
import "./AllNotificaions.css"
// import io  from "socket.io-client";

// const socket = io("http://localhost:4001", {
//     withCredentials: true,
//     transports: ['websocket', 'polling'],
//     secure: true
// });


function AllNotifications({ userId }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`/api/notifications/${userId}`);
                if (response.data) {
                    const formattedNotifications = response.data.map(notif => ({
                        ...notif,
                        created_at: new Date(notif.created_at) // Assuming 'created_at' is in UTC format
                    })).sort((a, b) => b.created_at - a.created_at);
                    setNotifications(formattedNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // socket.on('notification', notification => {
        //     const formattedNotification = {
        //         ...notification,
        //         created_at: new Date(notification.created_at)
        //     };
        //     setNotifications(prev => {
        //         return [...prev, formattedNotification].sort((a, b) => b.created_at - a.created_at);
        //     });
        // });
        //
        // return () => {
        //     socket.off('notification');
        // };
    }, [userId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() - 3);
        return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className={"notifications"}>
            <h1>All Notifications</h1>
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
