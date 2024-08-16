const conn = require('../config/db');
class DepartmentCourseModel {
    static getAllDepartmentsCourses() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT d.department_id, d.department_name, dc.id, dc.level, dc.semester, c.course_code, c.course_name
                FROM departments as d 
                INNER JOIN departments_courses as dc ON d.department_id = dc.department_id
                INNER JOIN courses as c ON dc.course_id = c.course_code
            `;
            conn.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static addDepartmentCourse(department_id, course_id, level, semester) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO departments_courses (department_id, course_id, level, semester) VALUES (?, ?, ?, ?)';
            conn.query(query, [department_id, course_id, level, semester], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static updateDepartmentCourse(id, department_id, course_id, level, semester) {
        return new Promise((resolve, reject) => {
            const fields = [];
            if (department_id !== undefined) fields.push(`department_id = '${department_id}'`);
            if (course_id !== undefined) fields.push(`course_id = '${course_id}'`);
            if (level !== undefined) fields.push(`level = ${level}`);
            if (semester !== undefined) fields.push(`semester = ${semester}`);

            const query = `UPDATE departments_courses SET ${fields.join(', ')} WHERE id = ?`;
            conn.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static deleteDepartmentCourse(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM departments_courses WHERE id = ?';
            conn.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = DepartmentCourseModel;
