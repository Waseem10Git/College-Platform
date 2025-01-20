// models/ChapterModel.js
const conn = require('../config/db');
const util = require('util');

const queryAsync = util.promisify(conn.query).bind(conn);

class ChapterModel {
    static async getChaptersByCourseCode(courseCode) {
        const query = 'SELECT id, chapter_name FROM chapters WHERE course_id = ?';
        return await queryAsync(query, [courseCode]);
    }

    static async checkCourseExists(courseCode) {
        const query = 'SELECT * FROM courses WHERE course_code = ?';
        const results = await queryAsync(query, [courseCode]);
        return results.length > 0;
    }

    static async insertChapter(courseCode, originalname, mimetype, size, filePath) {
        const query = `INSERT INTO chapters (course_id, chapter_name, chapter_path, chapter_size, chapter_mime_type) 
                                VALUES (?, ?, ?, ?, ?)`;
        return await queryAsync(query, [courseCode, originalname, filePath, size, mimetype]);
    }

    static async getChapterById(chapterId) {
        const query = 'SELECT chapter_name, chapter_path FROM chapters WHERE id = ?';
        const results = await queryAsync(query, [chapterId]);
        return results.length > 0 ? results[0] : null;
    }

    static async deleteChapterById(chapterId) {
        const query = 'DELETE FROM chapters WHERE id = ?';
        return await queryAsync(query, [chapterId]);
    }

    static async updateChapter(chapterId, fileName, mimetype, size, filePath) {
        const query = 'UPDATE chapters SET chapter_name = ?, chapter_path = ?, chapter_size = ?, chapter_mime_type WHERE id = ?';
        return await queryAsync(query, [fileName, filePath, size, mimetype, chapterId]);
    }

    static async getChapterContentById(chapterId) {
        const query = 'SELECT chapter_name, chapter_path, chapter_mime_type FROM chapters WHERE id = ?';
        const results = await queryAsync(query, [chapterId]);
        return results.length > 0 ? results[0] : null;
    }
}

module.exports = ChapterModel;
