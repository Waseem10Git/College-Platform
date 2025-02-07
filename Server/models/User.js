const conn = require('../config/db');
const bcrypt = require('bcrypt');

class UserModel {

    static getAllUsers() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users LEFT JOIN departments USING(department_id)";
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

    static getLastUserId() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id FROM users ORDER BY id DESC LIMIT 1";
            conn.query(sql, (err, results) => {
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
            conn.query(sql, [userId], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.length > 0 ? result[0] : null);
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

    static addAccount({ userID, firstName, lastName, email, password, role, departmentID }) {

        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO users (id, first_name, last_name, email, password, role, department_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            bcrypt.hash(password.toString(), 10, (err, hash) => {
                if (err) {
                    return reject("Error hashing password");
                }

                const departmentValue = !departmentID ? null : departmentID;

                const values = [userID, firstName, lastName, email, hash, role, departmentValue];
                conn.query(sql, values, (err, result) => {
                    if (err) {
                        return reject("Error, Please use the right template");
                    }
                    resolve(result);
                });
            });
        });
    }

    static async updateAccount({ newFirstName, newLastName, newEmail, newPassword, newRole, newDepartmentID, userID, newUserID }) {
        const fields = [];
        const values = [];

        if (newUserID) {
            fields.push("id = ?");
            values.push(newUserID);
        }
        if (newFirstName) {
            fields.push("first_name = ?");
            values.push(newFirstName);
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
        if (newRole) {
            fields.push("role = ?");
            values.push(newRole);

            if (newRole === "student") {
                if (newDepartmentID) {
                    fields.push("department_id = ?");
                    values.push(newDepartmentID);
                } else {
                    console.error('newDepartmentID is required for students');
                }
            } else if (newRole === "instructor") {
                // If the role is 'instructor', set department_id to null
                fields.push("department_id = NULL");
            }
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

    static async deleteAccount(id) {
        const sql = "DELETE FROM users WHERE id=?";

        return new Promise((resolve, reject) => {
            conn.query(sql, [id], (err, result) => {
                if (err) {
                    return reject("Deleting data Error in server");
                }
                resolve(result);
            });
        });
    }
}

module.exports = UserModel;
