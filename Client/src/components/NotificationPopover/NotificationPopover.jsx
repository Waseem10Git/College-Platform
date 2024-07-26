import React from 'react';
import './NotificationPopover.css';
import { Link } from "react-router-dom";

const NotificationPopover = ({ notifications }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() - 3);
        return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="popover">
            <ul className="list">
                <li className={"notifications-number"}>
                    Notifications({notifications.length})
                </li>
                {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                        <li key={index} className="item">
                            {notif.message}
                            <p>{formatDate(notif.created_at)}</p>
                        </li>
                    ))
                ) : (
                    <li className={"no-notifications-text"}>
                        <p className="no-notifications">No new notifications</p>
                    </li>
                )}
                <li className="see-all-link">
                    <Link to="/notifications">See all notifications</Link>
                </li>
            </ul>
        </div>
    );
};

export default NotificationPopover;
