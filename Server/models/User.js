const conn = require('../config/db');

class UserModel {
    static async getUsers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users";
            conn.query(sql, [], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async getUserById(userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE id = ?";
            conn.query(sql, [userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            conn.query(sql, [email], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async addUser(firstName, middleName, lastName, email, hash, role, departmentName) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO users (first_name, middle_name, last_name, email, password, role, department_id)
                         VALUES (?, ?, ?, ?, ?, ?, (SELECT department_id FROM departments WHERE department_name = ?))`;
            const values = [firstName, middleName, lastName, email, hash, role, departmentName];
            conn.query(sql, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async updateUser(fields, values) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
            conn.query(sql, values, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async deleteUser(userID) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM users WHERE id = ?';
            conn.query(sql, [userID], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static updatePassword(userId, hashedPassword) {
        return new Promise((resolve, reject) => {
            conn.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
                if (err) {
                    console.error("Error updating password:", err);
                    reject("Error updating password");
                } else {
                    resolve();
                }
            });
        });
    }

    static updateImage(userId, imageData) {
        return new Promise((resolve, reject) => {
            conn.query('UPDATE users SET image = ? WHERE id = ?', [imageData, userId], (err, result) => {
                if (err) {
                    console.error("Error updating image:", err);
                    reject("Error updating image");
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = UserModel;
