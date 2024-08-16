const express = require('express');
const asyncHandler = require('express-async-handler');

function notificationRoutes(notificationController) {
    const router = express.Router();

    router.get('/notifications/:id', asyncHandler(notificationController.getNotifications.bind(notificationController)));
    router.get('/unread-notifications/:id', asyncHandler(notificationController.getUnreadNotifications.bind(notificationController)));
    router.post('/mark-notifications-read/:id', asyncHandler(notificationController.markNotificationsAsRead.bind(notificationController)));
    router.post('/send-notification', asyncHandler(notificationController.sendNotification.bind(notificationController)));

    return router;
}

module.exports = notificationRoutes;
