import axios from "./axios";

const sendNotification = (userId, courseCode, EnNotificationMessage, ArNotificationMessage) => axios.post(`/api/send-notification`, {
    userId: userId,
    courseCode: courseCode,
    EnMessage: EnNotificationMessage,
    ArMessage: ArNotificationMessage
});

const notificationApi = { sendNotification };
export default notificationApi;