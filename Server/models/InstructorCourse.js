const conn = require('../config/db');

class InstructorCourseModel {
    static addInstructorToCourses(instructor_id, department_course_ids) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO instructors_courses (instructor_id, department_course_id) VALUES (?, ?)';

            department_course_ids.forEach(id => {
                conn.query(sql, [instructor_id, id], (err, results) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return reject({ status: 400, message: 'Already added' });
                        } else {
                            return reject({ status: 500, message: 'Error inserting into instructors_courses', error: err });
                        }
                    }
                });
            });

            resolve({ success: true });
        });
    }

    static deleteInstructorCourse(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM instructors_courses WHERE id = ?';
            conn.query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getInstructorCourseId(userId, selectedCourse) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT IC.id, C.course_name 
                FROM instructors_courses as IC
                INNER JOIN departments_courses as DC ON IC.department_course_id = DC.id
                INNER JOIN courses as C ON DC.course_id = C.course_code
                WHERE IC.instructor_id = ? AND DC.course_id = ?
            `;
            conn.query(query, [userId, selectedCourse], (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    }

    static getAllInstructorCourses() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM instructors_courses";
            conn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getInstructorsDepartmentsCourses() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.id as user_id, u.first_name, u.last_name, ic.id as instructor_course_id, ic.department_course_id, c.course_code, c.course_name, d.department_name
                FROM users as u
                INNER JOIN instructors_courses as ic on u.id = ic.instructor_id
                INNER JOIN departments_courses as dc on dc.id = ic.department_course_id
                INNER JOIN courses as c on dc.course_id = c.course_code
                INNER JOIN departments as d on dc.department_id = d.department_id
            `;
            conn.query(sql, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    static async getInstructorIdByEmail(email) {
        const query = 'SELECT id FROM users WHERE email = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [email], (err, results) => {
                if (err) {
                    return reject("Error fetching instructor ID from the database.");
                }
                resolve(results[0].id);
            });
        });
    }

    static async addInstructorCourses(values) {
        const insertQuery = 'INSERT INTO instructors_courses (instructor_id, department_course_id) VALUES ?';
        return new Promise((resolve, reject) => {
            conn.query(insertQuery, [values], (err, result) => {
                if (err) {
                    return reject("Error inserting instructor-courses into the database.");
                }
                resolve(result);
            });
        });
    }

    static checkSingleInstructorCourseExistence(id) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT EXISTS (
                SELECT 1 FROM instructors_courses WHERE id = ?
            ) AS exist;
        `;
            conn.query(sql, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0].exist === 1);
            });
        });
    }

    static async checkInstructorCourseExistence(instructor_id, department_course_ids) {
        return new Promise((resolve, reject) => {
            // Generate the instructor_course_id
            const ids = department_course_ids.map(department_course_id => `${instructor_id}_${department_course_id}`);

            const placeholders = ids.map(() => '?').join(', ');
            const sql = `
            SELECT id 
            FROM instructors_courses 
            WHERE id IN (${placeholders});
        `;

            conn.query(sql, ids, (err, results) => {
                if (err) {
                    return reject(err);
                }
                console.log(results);

                // If any results are found, it means there's a duplicate
                if (results.length > 0) {
                    return resolve(true); // Indicate duplicate found
                }

                // If no results found, all ids are unique and can be added
                resolve(false);
            });
        });
    }

    static checkAssignmentTitleExistence(instructor_course_id, assignmentName) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT EXISTS (
                SELECT 1
                FROM instructors_courses_assignments AS ica
                INNER JOIN instructors_courses AS ic
                    ON ica.instructors_courses_id = ic.id
                INNER JOIN assignments AS a
                    ON ica.assignment_id = a.assignment_id
                WHERE ic.id = ?
                AND a.assignment_title = ?
            ) AS exist;
        `;
            conn.query(sql, [instructor_course_id, assignmentName], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0].exist === 1);
            });
        });
    }
}

module.exports = InstructorCourseModel;
