const conn = require('../config/db');
const bcrypt = require('bcrypt');

class UserModel {

    static getAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users";
            conn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getAllInstructors() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE role = ?";
            const value = "instructor";
            conn.query(sql, [value], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getAllStudents() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE role = ?";
            const value = "student";
            conn.query(sql, [value], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE email = ?";
            conn.query(sql, [email], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getUserById(userId) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE id = ?";
            conn.query(sql, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
    }

    static updatePassword(userId, hashedPassword) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET password = ? WHERE id = ?';
            conn.query(sql, [hashedPassword, userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static updateImage(userId, imageData) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET image = ? WHERE id = ?';
            conn.query(sql, [imageData, userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static addAccount({ userID, firstName, middleName, lastName, email, password, role, departmentName }) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO users (id, first_name, middle_name, last_name, email, password, role, department_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT department_id FROM departments WHERE department_name = ?))
            `;

            bcrypt.hash(password.toString(), 10, (err, hash) => {
                if (err) {
                    return reject("Error hashing password");
                }

                const values = [userID, firstName, middleName, lastName, email, hash, role, departmentName];
                conn.query(sql, values, (err, result) => {
                    if (err) {
                        return reject("Error inserting data");
                    }
                    resolve(result);
                });
            });
        });
    }

    static async updateAccount({ newFirstName, newMiddleName, newLastName, newEmail, newPassword, userID }) {
        const fields = [];
        const values = [];

        if (newFirstName) {
            fields.push("first_name = ?");
            values.push(newFirstName);
        }
        if (newMiddleName) {
            fields.push("middle_name = ?");
            values.push(newMiddleName);
        }
        if (newLastName) {
            fields.push("last_name = ?");
            values.push(newLastName);
        }
        if (newEmail) {
            fields.push("email = ?");
            values.push(newEmail);
        }
        if (newPassword) {
            const hash = await bcrypt.hash(newPassword.toString(), 10);
            fields.push("password = ?");
            values.push(hash);
        }

        values.push(userID);

        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            conn.query(sql, values, (err, result) => {
                if (err) {
                    return reject("Error updating data");
                }
                resolve(result);
            });
        });
    }

    static async deleteAccount(userID) {
        const sql = "DELETE FROM users WHERE id=?";

        return new Promise((resolve, reject) => {
            conn.query(sql, [userID], (err, result) => {
                if (err) {
                    return reject("Deleting data Error in server");
                }
                resolve(result);
            });
        });
    }
}

module.exports = UserModel;
