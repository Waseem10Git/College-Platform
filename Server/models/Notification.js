const conn = require('../config/db');

class NotificationModel {

    static createNotification(instructor_course_id, notificationMessage) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO notifications (instructor_course_id, message, is_read) VALUES (?, ?, 0)';
            conn.query(query, [instructor_course_id, notificationMessage], (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });
    }

    static getNotifications(studentId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT n.message, n.created_at 
            FROM user_notifications as un
            INNER JOIN notifications as n ON un.notification_id = n.id
            WHERE user_id = ?
            `;
            conn.query(sql, [studentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getUnreadNotifications(studentId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT n.message, n.created_at 
            FROM user_notifications as un
            INNER JOIN notifications as n ON un.notification_id = n.id
            WHERE user_id = ? AND is_read = 0
            `;
            conn.query(sql, [studentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static markNotificationsAsRead(studentId) {
        return new Promise((resolve, reject) => {
            const sql = `
           UPDATE user_notifications 
            SET is_read = 1
            WHERE user_id = ?
            `;
            conn.query(sql, [studentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static insertNotification(instructor_course_id, message) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO notifications (instructor_course_id, message) VALUES (?, ?)';
            conn.query(sql, [instructor_course_id, message], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static sendNotification(studentsIDs, notificationId) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO user_notifications (user_id, notification_id) VALUES ?';
            const values = studentsIDs.map(student => [student.student_id, notificationId]);
            conn.query(sql, [values], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = NotificationModel;
