const conn = require('../config/db');
class EnrollmentModel {
    static addStudentToCourse(student_id, course_id) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)';
            conn.query(sql, [student_id, course_id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getStudentEnrollments() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    su.id as student_id, 
                    su.first_name as student_fname, 
                    su.last_name as student_lname, 
                    e.id, 
                    c.course_code, 
                    c.course_name, 
                    d.department_name, 
                    iu.first_name as instructor_fname, 
                    iu.last_name as instructor_lname,
                    ic.id as instructor_course_id
                FROM users as su
                INNER JOIN enrollments as e ON su.id = e.student_id
                INNER JOIN instructors_courses as ic ON e.instructor_course_id = ic.id
                INNER JOIN users as iu ON ic.instructor_id = iu.id
                INNER JOIN departments_courses as dc ON ic.department_course_id = dc.id
                INNER JOIN courses as c ON dc.course_id = c.course_code
                INNER JOIN departments as d ON dc.department_id = d.department_id
            `;

            conn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static addStudentToInstructorCourses(student_id, instructor_course_ids) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO enrollments (student_id, instructor_course_id) VALUES (?, ?)';
            const errors = [];
            instructor_course_ids.forEach(id => {
                conn.query(sql, [student_id, id], (err, results) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            errors.push({ message: `Already added for instructor_course_id ${id}` });
                        } else {
                            errors.push({ message: `Error inserting into enrollments for instructor_course_id ${id}`, error: err });
                        }
                    }
                });
            });

            if (errors.length > 0) {
                return reject({ status: 400, messages: errors });
            }

            resolve({ success: true });
        });
    }

    static deleteStudentEnrollment(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM enrollments WHERE id = ?';
            conn.query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getAllEnrollments() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM enrollments";
            conn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getStudentsForCourse(courseId, userId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.id, u.first_name, u.last_name, u.email
                FROM enrollments e
                JOIN instructors_courses ic ON e.instructor_course_id = ic.id
                JOIN departments_courses dc ON ic.department_course_id = dc.id
                JOIN users u ON e.student_id = u.id
                WHERE dc.course_id = ? AND ic.instructor_id = ?
            `;
            conn.query(query, [courseId, userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getStudentsForInstructorCourse(instructorCourseId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT student_id FROM enrollments WHERE instructor_course_id = ?
            `;
            conn.query(query, [instructorCourseId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static checkSingleStudentCourseExistence(id) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT EXISTS (
                SELECT 1 FROM enrollments WHERE id = ?
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

    static async checkStudentCourseExistence(student_id, instructor_course_ids) {
        return new Promise((resolve, reject) => {
            // Generate the instructor_course_id
            const ids = instructor_course_ids.map(instructor_course_id => `${student_id}_${instructor_course_id}`);

            const placeholders = ids.map(() => '?').join(', ');
            const sql = `
            SELECT id 
            FROM enrollments 
            WHERE id IN (${placeholders});
        `;

            conn.query(sql, ids, (err, results) => {
                if (err) {
                    return reject(err);
                }

                // If any results are found, it means there's a duplicate
                if (results.length > 0) {
                    return resolve(true); // Indicate duplicate found
                }

                // If no results found, all ids are unique and can be added
                resolve(false);
            });
        });
    }
}

module.exports = EnrollmentModel;
