// chapterController.js
const chapterModel = require('../models/Chapter');

const MAX_LONG_BLOB_SIZE = 4 * 1024 * 1024 * 1024; // 4GB

class ChapterController {
    static async getAllChapters(req, res) {
        const courseCode = req.params.courseCode;
        try {
            const chapters = await chapterModel.getChaptersByCourse(courseCode);
            res.json(chapters);
        } catch (error) {
            console.error("Error fetching chapters:", error);
            res.status(500).json({ message: 'Database error' });
        }
    }

    static async uploadChapter(req, res) {
        const courseCode = req.params.courseCode;
        const fileName = req.file.originalname;
        const fileContent = req.file.buffer;

        if (req.file.size > MAX_LONG_BLOB_SIZE) {
            return res.status(400).json({
                message: `File is too large. Maximum size allowed is ${MAX_LONG_BLOB_SIZE / (1024 * 1024)} MB`
            });
        }

        try {
            const courseExists = await chapterModel.checkCourse(courseCode);
            if (!courseExists) {
                return res.status(400).json({ message: `Course with code ${courseCode} does not exist` });
            }

            await chapterModel.insertChapter(courseCode, fileName, fileContent);
            res.json({ message: 'Chapter uploaded successfully', fileName });
        } catch (error) {
            console.error("Error uploading chapter:", error);
            res.status(500).json({ message: 'Database error' });
        }
    }

    static async downloadChapter(req, res) {
        const chapterId = req.params.chapterId;
        try {
            const chapter = await chapterModel.getChapterById(chapterId);
            if (!chapter) {
                return res.status(404).send('File not found');
            }
            res.setHeader('Content-Disposition', 'attachment; filename=' + chapter.chapter_name);
            res.send(chapter.chapter_content);
        } catch (error) {
            console.error("Error downloading chapter:", error);
            res.status(500).json({ message: 'Database error' });
        }
    }

    static async deleteChapter(req, res) {
        const chapterId = req.params.chapterId;
        try {
            await chapterModel.deleteChapter(chapterId);
            res.json({ message: 'Chapter deleted successfully' });
        } catch (error) {
            console.error("Error deleting chapter:", error);
            res.status(500).json({ message: 'Database error' });
        }
    }

    static async updateChapter(req, res) {
        const chapterId = req.params.chapterId;
        const fileName = req.file.originalname;
        const fileContent = req.file.buffer;
        try {
            await chapterModel.updateChapter(chapterId, fileName, fileContent);
            res.json({ message: 'Chapter updated successfully', fileName });
        } catch (error) {
            console.error("Error updating chapter:", error);
            res.status(500).json({ message: 'Database error' });
        }
    }

    static async viewChapter(req, res) {
        const chapterId = req.params.chapterId;
        try {
            const chapter = await chapterModel.getChapterById(chapterId);
            if (!chapter) {
                return res.status(404).send('File not found');
            }
            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(chapter.chapter_content);
        } catch (error) {
            console.error("Error viewing chapter:", error);
            res.status(500).json({ message: 'Database error' });
        }
    }
}

module.exports = ChapterController;
