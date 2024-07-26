// courseModel.js
const conn = require('../config/db');

class CourseModel {
    static getAllCourses() {
        const query = 'SELECT * FROM courses';
        return new Promise((resolve, reject) => {
            conn.query(query, (err, results) => {
                if (err) {
                    console.error("Error fetching courses:", err);
                    reject("Error fetching courses");
                } else {
                    resolve(results);
                }
            });
        });
    }

    static addCourse(course_code, course_name, description) {
        const query = 'INSERT INTO courses (course_code, course_name, description) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            conn.query(query, [course_code, course_name, description], (err, results) => {
                if (err) {
                    console.error("Error adding course:", err);
                    reject("Error adding course");
                } else {
                    resolve(results);
                }
            });
        });
    }

    static updateCourse(id, course_name, description) {
        const query = 'UPDATE courses SET course_name = ?, description = ? WHERE course_code = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [course_name, description, id], (err, results) => {
                if (err) {
                    console.error("Error updating course:", err);
                    reject("Error updating course");
                } else {
                    resolve(results);
                }
            });
        });
    }

    static deleteCourse(id) {
        const query = 'DELETE FROM courses WHERE course_code = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [id], (err, results) => {
                if (err) {
                    console.error("Error deleting course:", err);
                    reject("Error deleting course");
                } else {
                    resolve(results);
                }
            });
        });
    }

    static getStudentCourses(userId) {
        const query = 'SELECT C.course_code, C.course_name, C.description FROM enrollments AS E INNER JOIN courses AS C ON C.course_code = E.course_id WHERE E.student_id = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [userId], (err, results) => {
                if (err) {
                    console.error("Error fetching student courses:", err);
                    reject("Error fetching student courses");
                } else {
                    resolve(results);
                }
            });
        });
    }

    static getInstructorCourses(userId) {
        const query = 'SELECT C.course_code, C.course_name, C.description FROM instructors_courses AS IC INNER JOIN courses AS C ON C.course_code = IC.course_id WHERE IC.instructor_id = ?';
        return new Promise((resolve, reject) => {
            conn.query(query, [userId], (err, results) => {
                if (err) {
                    console.error("Error fetching instructor courses:", err);
                    reject("Error fetching instructor courses");
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = CourseModel;
