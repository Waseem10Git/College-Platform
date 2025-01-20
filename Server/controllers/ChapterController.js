const conn = require('../config/db');
const ChapterModel = require('../models/Chapter');
const fs = require("fs");

const MAX_LONG_BLOB_SIZE = 4 * 1024 * 1024 * 1024; // 4GB

class ChapterController {
    static async getChaptersByCourseCode(req, res) {
        const courseCode = req.params.courseCode;

        try {
            const results = await ChapterModel.getChaptersByCourseCode(courseCode);
            res.json(results);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            res.status(500).json({ error: 'An error occurred while fetching chapters' });
        }
    }

    static async uploadChapter(req, res) {
        const courseCode = req.params.courseCode;
        const file = req.file;
        const { originalname, mimetype, size, path: filePath} = file;

        if (req.file.size > MAX_LONG_BLOB_SIZE) {
            return res.status(400).json({
                message: `File is too large. Maximum size allowed is ${MAX_LONG_BLOB_SIZE / (1024 * 1024)} MB`
            });
        }

        try {
            conn.beginTransaction(async (err) => {
                if (err) {
                    console.error('Transaction Error:', err);
                    return res.status(500).json({ error: 'Transaction Error' });
                }

                const courseExists = await ChapterModel.checkCourseExists(courseCode);

                if (!courseExists) {
                    return res.status(400).json({ message: `Course with code ${courseCode} does not exist` });
                }

                await ChapterModel.insertChapter(courseCode, originalname, mimetype, size, filePath);

                conn.commit((err) => {
                    if (err) {
                        return conn.rollback(() => {
                            console.error('Transaction commit failed:', err);
                            res.status(500).json({error: 'Transaction commit failed'});
                        });
                    }

                    res.status(200).json({message: 'Chapter uploaded successfully'});
                });
            })
        } catch (error) {
            console.error('Error uploading chapter:', error);
            res.status(500).json({ error: 'Failed to upload chapter' });
        }
    }

    static async downloadChapter(req, res) {
        const chapterId = req.params.chapterId;

        try {
            const chapter = await ChapterModel.getChapterById(chapterId);

            if (!chapter) {
                return res.status(404).send('File not found');
            }

            res.download(chapter.chapter_path, chapter.chapter_name);
        } catch (error) {
            console.error('Error downloading chapter:', error);
            res.status(500).json({ error: 'An error occurred while downloading the chapter' });
        }
    }

    static async deleteChapter(req, res) {
        const chapterId = req.params.chapterId;

        try {
            const chapter = await ChapterModel.getChapterById(chapterId);

            if (!chapter) {
                return res.status(404).send('File not found');
            }

            fs.unlink(chapter.chapter_path, async (err) => {
                if (err) {
                    console.error("Error deleting file from filesystem:", err);
                    return res.status(500).json({ error: "Failed to delete file from filesystem" });
                }

                await ChapterModel.deleteChapterById(chapterId);
                res.status(200).json({ message: 'Chapter deleted successfully' });
            })

        } catch (error) {
            console.error('Error deleting chapter:', error);
            res.status(500).json({ error: 'An error occurred while deleting the chapter' });
        }
    }

    static async updateChapter(req, res) {
        const chapterId = req.params.chapterId;
        const file = req.file;
        const { originalname: fileName, mimetype, size, path: filePath} = file;

        try {
            await ChapterModel.updateChapter(chapterId, fileName, mimetype, size, filePath);
            res.json({ message: 'Chapter updated successfully', fileName });
        } catch (error) {
            console.error('Error updating chapter:', error);
            res.status(500).json({ error: 'An error occurred while updating the chapter' });
        }
    }

    static async viewChapter(req, res) {
        const chapterId = req.params.chapterId;

        try {
            const chapter = await ChapterModel.getChapterContentById(chapterId);

            if (!chapter) {
                return res.status(404).send('File not found');
            }

            res.setHeader("Content-Type", chapter.chapter_mime_type);
            res.setHeader("Content-Disposition", "inline"); // Render in browser

            // Stream the file to the client
            const fileStream = fs.createReadStream(chapter.chapter_path);
            fileStream.pipe(res);

        } catch (error) {
            console.error('Error viewing chapter:', error);
            res.status(500).json({ error: 'An error occurred while viewing the chapter' });
        }
    }


}

module.exports = ChapterController;
