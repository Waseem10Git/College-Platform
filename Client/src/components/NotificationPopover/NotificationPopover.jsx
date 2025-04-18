import { useContext } from 'react';
import './NotificationPopover.css';
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

const NotificationPopover = ({ notifications }) => {
    const { language, isDarkMode } = useContext(UserContext);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours());
        return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true, day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const visibleNotifications = notifications.slice(0, 5); // Get the first 9 notifications
    const remainingCount = notifications.length - 5; // Calculate remaining notifications

    return (
        <div className={`popover ${isDarkMode ? 'dark-mode' : ''}`}>
            <ul className="list">
                <li className="notifications-number">
                    {language === 'En' ? 'Notifications' : 'الإشعارات'} ({notifications.length})
                </li>
                {notifications.length > 0 ? (
                    <>
                        {visibleNotifications.map((notif, index) => (
                            <li key={index} className="item">
                                {language === 'En' ? notif.EnMessage : notif.ArMessage}
                                <p>{formatDate(notif.created_at)}</p>
                            </li>
                        ))}
                        {remainingCount > 0 && (
                            <li className="item extra-notifications">
                                +{remainingCount} {language === 'En' ? 'more' : 'إشعارات أخرى'}
                            </li>
                        )}
                    </>
                ) : (
                    <li className="no-notifications-text">
                        <p className="no-notifications">{language === 'En' ? 'No new notifications' : 'ليس هناك أي إشعارات جديدة'}</p>
                    </li>
                )}
                <li className="see-all-link">
                    <Link to="/notifications">{language === 'En' ? 'See all notifications' : 'كل الإشعارات'}</Link>
                </li>
            </ul>
        </div>
    );
};

export default NotificationPopover;
