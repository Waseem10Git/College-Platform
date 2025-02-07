const NotificationModel = require('../models/Notification');
const InstructorCourseModel = require("../models/InstructorCourse");
const EnrollmentModel = require("../models/Enrollment");
const conn = require("../config/db");

class NotificationController {

    static async getNotifications(req, res) {
        try {
            const { id } = req.params;
            const notifications = await NotificationModel.getNotifications(id);
            return res.json(notifications);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).send('Server error');
        }
    }

    static async getUnreadNotifications(req, res) {
        try {
            const { id } = req.params;
            const unreadNotifications = await NotificationModel.getUnreadNotifications(id);
            return res.json(unreadNotifications);
        } catch (err) {
            console.error('Error fetching unread notifications:', err);
            return res.status(500).send('Server error');
        }
    }

    static async markNotificationsAsRead(req, res) {
        try {
            const { id } = req.params;
            await NotificationModel.markNotificationsAsRead(id);
            return res.json({ message: 'Notifications marked as read' });
        } catch (err) {
            console.error('Error marking notifications as read:', err);
            return res.status(500).send('Server error');
        }
    }

    static async sendNotification(req, res) {
        try {
            const { userId, courseCode, EnMessage, ArMessage } = req.body;

            conn.beginTransaction(async (err) => {
                if (err) {
                    console.error('Transaction Error:', err);
                    return res.status(500).json({ success: false, EnMessage: 'Transaction Error', ArMessage: 'خطأ في المعاملة' });
                }

                const result = await InstructorCourseModel.getInstructorCourseId(userId, courseCode);

                if (result.length === 0) {
                    return conn.rollback(() => {
                        console.error('No matching instructor_course_id found');
                        res.status(404).json({ success: false, EnMessage: 'No matching instructor_course_id found', ArMessage: 'لا يوجد رقم تعريفي مطابق' });
                    });
                }

                const instructor_course_id = result[0].id;
                const course_name = result[0].course_name;
                const EnNotificationMessage = EnMessage + course_name;
                const ArNotificationMessage = ArMessage + course_name;

                // Insert the notification
                const notificationResult = await NotificationModel.insertNotification(instructor_course_id, EnNotificationMessage, ArNotificationMessage);

                // Get the last inserted notification ID
                const notificationId = notificationResult.insertId;

                // Get all students enrolled in the course using the EnrollmentModel
                const students = await EnrollmentModel.getStudentsForInstructorCourse(instructor_course_id);

                if (students.length > 0) {
                    await NotificationModel.sendNotification(students, notificationId);
                }

                // Commit the transaction
                conn.commit((err) => {
                    if (err) {
                        return conn.rollback(() => {
                            console.error('Transaction commit failed:', err);
                            res.status(500).json({ success: false, EnMessage: 'Transaction commit failed', ArMessage: 'فشل تأكيد المعاملة' });
                        });
                    }

                    res.status(200).send('Notification sent');
                });
            });
        } catch (err) {
            console.error('Error sending notification:', err);
            return res.status(500).json({ success: false, EnMessage:'Server error', ArMessage: 'خطأ في الخادم' });
        }
    }
}

module.exports = NotificationController;
