import axios from "./axios";

const sendNotification = (userId, courseCode, notificationMessage) => axios.post(`/api/send-notification`, {
    userId: userId,
    courseCode: courseCode,
    message: notificationMessage
});

const notificationApi = { sendNotification };
export default notificationApi;