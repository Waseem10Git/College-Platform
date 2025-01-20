const conn = require('../config/db');

class Delete {
    static async deleteTableData() {
        const queries = [
            'SET FOREIGN_KEY_CHECKS = 0',
            'DELETE FROM student_answers',
            'DELETE FROM enrollments_exams',
            'DELETE FROM enrollments_assignments',
            'DELETE FROM user_notifications',
            'DELETE FROM notifications',
            'DELETE FROM enrollments',
            'DELETE FROM instructors_courses_assignments',
            'DELETE FROM instructors_courses_exams',
            'DELETE FROM instructors_courses',
            'DELETE FROM departments_courses',
            'DELETE FROM answers',
            'DELETE FROM questions',
            'DELETE FROM exams',
            'DELETE FROM chapters',
            'DELETE FROM assignments',
            'DELETE FROM courses',
            'SET FOREIGN_KEY_CHECKS = 1',
        ];

        try {
            for (const query of queries) {
                await new Promise((resolve, reject) => {
                    conn.query(query, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            }
            console.log('All data deleted successfully.');
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }
}

module.exports = Delete;
