const NotificationModel = require('../models/notification');

class NotificationController {
    constructor(io) {
        this.io = io;
    }

    async emitNotification(userId, message) {
        try {
            this.io.emit('notification', {userId, message});
            console.log(`Notification sent to user ${userId}: ${message}`);
        } catch (err) {
            console.error('Error creating notification:', err);
        }
    }

    async getNotifications(req, res) {
        try {
            const { id } = req.params;
            const notifications = await NotificationModel.getNotifications(id);
            return res.json(notifications);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).send('Server error');
        }
    }

    async getUnreadNotifications(req, res) {
        try {
            const { id } = req.params;
            const unreadNotifications = await NotificationModel.getUnreadNotifications(id);
            return res.json(unreadNotifications);
        } catch (err) {
            console.error('Error fetching unread notifications:', err);
            return res.status(500).send('Server error');
        }
    }

    async markNotificationsAsRead(req, res) {
        try {
            const { id } = req.params;
            await NotificationModel.markNotificationsAsRead(id);
            return res.json({ message: 'Notifications marked as read' });
        } catch (err) {
            console.error('Error marking notifications as read:', err);
            return res.status(500).send('Server error');
        }
    }

    async sendNotification(req, res) {
        try {
            const { userId, message } = req.body;
            await NotificationModel.sendNotification(userId, message);

            // Emit the notification to all connected clients
            this.io.emit('notification', { userId, message });

            return res.status(200).send('Notification sent');
        } catch (err) {
            console.error('Error sending notification:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = NotificationController;
