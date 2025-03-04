const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const notificationController = require('../controllers/NotificationController')
const { verifyToken } = require('../middlewares/auth');

router.get('/notifications/:id', verifyToken, asyncHandler(notificationController.getNotifications));
router.get('/unread-notifications/:id', verifyToken, asyncHandler(notificationController.getUnreadNotifications));
router.post('/mark-notifications-read/:id', verifyToken, asyncHandler(notificationController.markNotificationsAsRead));
router.post('/send-notification', verifyToken, asyncHandler(notificationController.sendNotification));

module.exports = router;
