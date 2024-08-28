const NotificationModel = require('../models/notification');
const InstructorCourseModel = require("../models/InstructorCourse");
const EnrollmentModel = require("../models/Enrollment");
const conn = require("../config/db");

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
            const { userId, courseCode, message } = req.body;

            conn.beginTransaction(async (err) => {
                if (err) {
                    console.error('Transaction Error:', err);
                    return res.status(500).json({ error: 'Transaction Error' });
                }

                const result = await InstructorCourseModel.getInstructorCourseId(userId, courseCode);

                if (result.length === 0) {
                    return conn.rollback(() => {
                        console.error('No matching instructor_course_id found');
                        res.status(404).json({ error: 'No matching instructor_course_id found' });
                    });
                }

                const instructor_course_id = result[0].id;
                const course_name = result[0].course_name;
                const notificationMessage = message + course_name;

                // Insert the notification
                const notificationResult = await NotificationModel.insertNotification(instructor_course_id, notificationMessage);

                // Get the last inserted notification ID
                const notificationId = notificationResult.insertId;
                console.log('notification Id: ', notificationId);

                // Get all students enrolled in the course using the EnrollmentModel
                const students = await EnrollmentModel.getStudentsForInstructorCourse(instructor_course_id);

                // Insert the notification ID and student IDs into the user_notifications table using the NotificationModel
                await NotificationModel.sendNotification(students, notificationId);

                // Commit the transaction
                conn.commit((err) => {
                    if (err) {
                        return conn.rollback(() => {
                            console.error('Transaction commit failed:', err);
                            res.status(500).json({ error: 'Transaction commit failed' });
                        });
                    }

                    // Emit the notification to all connected clients
                    this.io.emit('notification', { userId, message });
                    res.status(200).send('Notification sent');
                });
            });
        } catch (err) {
            console.error('Error sending notification:', err);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = NotificationController;
