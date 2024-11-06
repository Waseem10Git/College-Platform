// courseModel.js
const conn = require('../config/db');

class CourseModel {
    static getAllCoursesAndInstructors() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT U.first_name, U.last_name, U.email, C.course_code, C.course_name 
                FROM users AS U 
                INNER JOIN instructors_courses AS IC ON U.id = IC.instructor_id
                INNER JOIN departments_courses AS DC ON IC.department_course_id = DC.id
                INNER JOIN courses AS C ON DC.course_id = C.course_code
            `;
            conn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getAllInstructorCoursesDepartments() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM courses AS C
                INNER JOIN departments_courses AS DC ON C.course_code = DC.course_id
                INNER JOIN instructors_courses AS IC ON DC.id = IC.department_course_id
                INNER JOIN users AS U ON IC.instructor_id = U.id
            `;
            conn.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getAllCoursesForStudent(studentId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT C.course_code, C.course_name, C.description, C.image
                FROM courses AS C 
                INNER JOIN departments_courses AS DC ON C.course_code = DC.course_id
                INNER JOIN instructors_courses AS IC ON DC.id = IC.department_course_id
                INNER JOIN enrollments AS E ON E.instructor_course_id = IC.id
                WHERE E.student_id = ?
            `;
            conn.query(query, [studentId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getAllCoursesForInstructor(instructorId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT C.course_code, C.course_name, C.description, C.image
                FROM instructors_courses AS IC 
                INNER JOIN departments_courses as DC ON IC.department_course_id = DC.id
                INNER JOIN courses AS C ON C.course_code = DC.course_id 
                WHERE IC.instructor_id = ?
            `;
            conn.query(query, [instructorId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static getCourseById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM courses WHERE course_code = ?`;
            conn.query(query, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            })
        })
    }

    static getCourseByName(name) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM courses WHERE course_name = ?`;
            conn.query(query, [name], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            })
        })
    }

    static getCoursesByInstructorId(instructorId) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT C.course_code, C.course_name
            FROM courses as C
            INNER JOIN departments_courses as DC ON C.course_code = DC.course_id
            INNER JOIN instructors_courses as IC ON IC.department_course_id = DC.id
            INNER JOIN users as U ON IC.instructor_id = U.id
            WHERE U.id = ?
        `;
            conn.query(query, [instructorId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static addCourse(courseData) {
        return new Promise((resolve, reject) => {
            const { course_code, course_name } = courseData;
            const query = 'INSERT INTO courses (course_code, course_name) VALUES (?, ?)';
            conn.query(query, [course_code, course_name], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static updateCourse({ id, course_code, course_name }) {
        return new Promise((resolve, reject) => {

            let updateCourseQuery = 'UPDATE courses SET ';
            const updateValues = [];

            if (course_code) {
                updateCourseQuery += 'course_code = ?, ';
                updateValues.push(course_code);
            }
            if (course_name) {
                updateCourseQuery += 'course_name = ?, ';
                updateValues.push(course_name);
            }

            updateCourseQuery = updateCourseQuery.slice(0, -2); // Remove last comma
            updateCourseQuery += ' WHERE course_code = ?';
            updateValues.push(id);

            conn.query(updateCourseQuery, updateValues, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static deleteCourse(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM courses WHERE course_code = ?';
            conn.query(sql, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async getAllCourses() {
        const query = `SELECT * FROM courses`;

        return new Promise((resolve, reject) => {
            conn.query(query, (err, results) => {
                if (err) {
                    return reject("Error fetching courses from the database.");
                }
                resolve(results);
            });
        });
    }

    static async createCourse(courseCode, courseName, description) {
        const query = 'INSERT INTO courses (course_code, course_name, description) VALUES (?, ?, ?)';

        return new Promise((resolve, reject) => {
            conn.query(query, [courseCode, courseName, description], (err, result) => {
                if (err) {
                    return reject("Error inserting course into the database.");
                }
                resolve(result);
            });
        });
    }

    static async linkCourseToDepartment(departmentId, courseCode) {
        const query = 'INSERT INTO departments_courses (department_id, course_id) VALUES (?, ?)';

        return new Promise((resolve, reject) => {
            conn.query(query, [departmentId, courseCode], (err) => {
                if (err) {
                    return reject("Error linking course to department.");
                }
                resolve();
            });
        });
    }

}

module.exports = CourseModel;
