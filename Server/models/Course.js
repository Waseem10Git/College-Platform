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
                SELECT C.course_code, C.course_name, C.description
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
                SELECT C.course_code, C.course_name, C.description 
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

    // static async getCoursesByInstructorId(instructorId) {
    //     const query = `
    //         SELECT C.course_code, C.course_name
    //         FROM courses as C
    //         INNER JOIN departments_courses as DC ON C.course_code = DC.course_id
    //         INNER JOIN instructors_courses as IC ON IC.department_course_id = DC.id
    //         INNER JOIN users as U ON IC.instructor_id = U.id
    //         WHERE U.id = ?
    //     `;
    //     const results = await queryAsync(query, [instructorId]);
    //     return results;
    // }

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

    // static async addCourse(courseData) {
    //     const { id, name, description, image } = courseData;
    //     const query = 'INSERT INTO courses (course_code, course_name, description, image) VALUES (?, ?, ?, ?)';
    //     await queryAsync(query, [id, name, description, image]);
    // }

    static addCourse(courseData) {
        return new Promise((resolve, reject) => {
            const { id, name, description, image } = courseData;
            const query = 'INSERT INTO courses (course_code, course_name, description, image) VALUES (?, ?, ?, ?)';
            conn.query(query, [id, name, description, image], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static updateCourse({ id, name, description, image }) {
        return new Promise((resolve, reject) => {
            let updateCourseQuery = 'UPDATE courses SET ';
            const updateValues = [];

            if (name) {
                updateCourseQuery += 'course_name = ?, ';
                updateValues.push(name);
            }
            if (description) {
                updateCourseQuery += 'description = ?, ';
                updateValues.push(description);
            }
            if (image) {
                updateCourseQuery += 'image = ?, ';
                updateValues.push(image);
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

    // static async deleteCourse(courseCode) {
    //     const query = 'DELETE FROM courses WHERE course_code = ?';
    //
    //     return new Promise((resolve, reject) => {
    //         conn.query(query, [courseCode], (err, result) => {
    //             if (err) {
    //                 return reject("Error deleting course from the database.");
    //             }
    //             resolve(result);
    //         });
    //     });
    // }
}

module.exports = CourseModel;
