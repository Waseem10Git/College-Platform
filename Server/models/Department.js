// models/DepartmentModel.js
const conn = require('../config/db');
const util = require('util');

const queryAsync = util.promisify(conn.query).bind(conn);

class DepartmentModel {
    static async getAllDepartments() {
        const query = "SELECT * FROM departments";
        const results = await queryAsync(query);
        return results;
    }

    static async addDepartment(department_name) {
        const query = 'INSERT INTO departments (department_name) VALUES (?)';
        const results = await queryAsync(query, [department_name]);
        return results;
    }

    static async updateDepartment(id, department_name) {
        const query = 'UPDATE departments SET department_name = ? WHERE department_id = ?';
        const results = await queryAsync(query, [department_name, id]);
        return results;
    }

    static async deleteDepartment(id) {
        const query = 'DELETE FROM departments WHERE department_id = ?';
        const results = await queryAsync(query, [id]);
        return results;
    }

    static async addLevelToDepartment(department_id, level, semester) {
        const query = 'INSERT INTO departments_courses (department_id, level, semester) VALUES (?, ?, ?)';
        const results = await queryAsync(query, [department_id, level, semester]);
        return results;
    }

    static async deleteLevelFromDepartment(department_id, level) {
        const query = 'DELETE FROM departments_courses WHERE department_id = ? AND level = ?';
        const results = await queryAsync(query, [department_id, level]);
        return results;
    }
}

module.exports = DepartmentModel;
