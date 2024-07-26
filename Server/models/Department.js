// departmentModel.js
const conn = require('../config/db');

class DepartmentModel {
    static getAllDepartments() {
        const sql = "SELECT * FROM departments_courses";
        return new Promise((resolve, reject) => {
            conn.query(sql, (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error fetching departments");
                } else {
                    resolve(result);
                }
            });
        });
    }

    static addDepartment(department_name) {
        const sql = 'INSERT INTO departments (department_name) VALUES (?)';
        return new Promise((resolve, reject) => {
            conn.query(sql, [department_name], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error adding department");
                } else {
                    resolve(result);
                }
            });
        });
    }

    static deleteDepartment(id) {
        const sql = 'DELETE FROM departments WHERE department_id = ?';
        return new Promise((resolve, reject) => {
            conn.query(sql, [id], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error deleting department");
                } else {
                    resolve(result);
                }
            });
        });
    }

    static addLevelToDepartment(department_id, level, semester) {
        const sql = 'INSERT INTO departments_courses (department_id, level, semester) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            conn.query(sql, [department_id, level, semester], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error adding level to department");
                } else {
                    resolve(result);
                }
            });
        });
    }

    static deleteLevelFromDepartment(department_id, level) {
        const sql = 'DELETE FROM departments_courses WHERE department_id = ? AND level = ?';
        return new Promise((resolve, reject) => {
            conn.query(sql, [department_id, level], (err, result) => {
                if (err) {
                    console.error("Database error:", err);
                    reject("Error deleting level from department");
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = DepartmentModel;
