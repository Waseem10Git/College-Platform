// chapterModel.js
const conn = require('../config/db');

class ChapterModel {
    static async getChaptersByCourse(courseCode) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, chapter_name FROM chapters WHERE course_id = ?';
            conn.query(query, [courseCode], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async checkCourse(courseCode) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM courses WHERE course_code = ?';
            conn.query(query, [courseCode], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.length > 0);
            });
        });
    }

    static async insertChapter(courseCode, chapterName, chapterContent) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO chapters (course_id, chapter_name, chapter_content) VALUES (?, ?, ?)';
            conn.query(query, [courseCode, chapterName, chapterContent], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async getChapterById(chapterId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT chapter_name, chapter_content FROM chapters WHERE id = ?';
            conn.query(query, [chapterId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]);
            });
        });
    }

    static async deleteChapter(chapterId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM chapters WHERE id = ?';
            conn.query(query, [chapterId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static async updateChapter(chapterId, chapterName, chapterContent) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE chapters SET chapter_name = ?, chapter_content = ? WHERE id = ?';
            conn.query(query, [chapterName, chapterContent, chapterId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}

module.exports = ChapterModel;
