const conn = require('../config/db');

class NotificationModel {
    static getNotifications(studentId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT n.id, n.message, n.is_read, n.created_at 
            FROM notifications as n 
            INNER JOIN enrollments as e ON n.instructor_course_id = e.instructor_course_id
            WHERE e.student_id = ?
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
            FROM notifications as n 
            INNER JOIN enrollments as e ON n.instructor_course_id = e.instructor_course_id
            WHERE e.student_id = ? AND n.is_read = 0
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
            UPDATE notifications 
            SET is_read = 1 
            WHERE id IN (
                SELECT n.id 
                FROM notifications as n 
                INNER JOIN enrollments as e ON n.instructor_course_id = e.instructor_course_id
                WHERE e.student_id = ? AND n.is_read = 0
            )`;
            conn.query(sql, [studentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static sendNotification(userId, message) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, 0)';
            conn.query(sql, [userId, message], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }
}

module.exports = NotificationModel;
