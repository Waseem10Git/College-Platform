import React, {useEffect, useRef, useState} from 'react';
import { io } from 'socket.io-client';
import axios from '../../api/axios';
import {MdNotificationsActive} from "react-icons/md";
import NotificationPopover from '../NotificationPopover/NotificationPopover';
import "./Notifications.css"

const socket = io("wss://college-platform-production.up.railway.app/socket.io", {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    secure: true
});


function Notifications({ userId }) {
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [showPopover, setShowPopover] = useState(false);
    const popoverRef = useRef(null);

    useEffect(() => {
        // Fetch unread notifications
        axios.get(`/api/unread-notifications/${userId}`)
            .then(response => {
                if (response.data){
                    const formattedNotifications = response.data.map(notif => ({
                        ...notif,
                        created_at: new Date(notif.created_at).toISOString()
                    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setUnreadNotifications(formattedNotifications);
                }
            })
            .catch(error => {
                console.error('Error fetching unread notifications:', error);
            });

        // Listen for new notifications
        socket.on('notification', notification => {
            const formattedNotification = {
                ...notification,
                created_at: new Date(notification.created_at).toISOString()
            };
            setUnreadNotifications(prev => {
                return [...prev, formattedNotification].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            });
        });

        return () => {
            socket.off('notification');
        };
    }, [userId]);

    useEffect(() => {
        if (showPopover) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopover]);

    const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            setShowPopover(false);
            markNotificationsAsRead();
        }
    };

    const markNotificationsAsRead = () => {
        axios.post(`/api/mark-notifications-read/${userId}`)
            .then(() => {
                setUnreadNotifications([]);
            })
            .catch(error => {
                console.error('Error marking notifications as read:', error);
            });
    };

    const togglePopover = () => {
        setShowPopover(prev => !prev);
    };

    return (
        <div className={"notifications-container"}>
            <MdNotificationsActive onClick={togglePopover} size={20} />
            {unreadNotifications.length > 0 && (
                <span className="notification-counter">{unreadNotifications.length}</span>
            )}
            {showPopover && (
                <div ref={popoverRef}>
                    <NotificationPopover notifications={unreadNotifications} />
                </div>
            )}
        </div>
    );
}

export default Notifications;
