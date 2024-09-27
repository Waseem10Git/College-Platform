const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const notificationController = require('../controllers/NotificationController')

router.get('/notifications/:id', asyncHandler(notificationController.getNotifications));
router.get('/unread-notifications/:id', asyncHandler(notificationController.getUnreadNotifications));
router.post('/mark-notifications-read/:id', asyncHandler(notificationController.markNotificationsAsRead));
router.post('/send-notification', asyncHandler(notificationController.sendNotification));

module.exports = router;
