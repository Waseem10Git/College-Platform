const conn = require('../config/db');
const ChapterModel = require('../models/Chapter');
const InstructorCourseModel = require('../models/InstructorCourse')
const NotificationModel = require("../models/Notification");
const NotificationController = require("./NotificationController");

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
        const userId = req.body.userId;
        const fileName = req.file.originalname;
        const fileContent = req.file.buffer;

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

                console.log('userId: ', userId);
                console.log('courseCode: ', courseCode);
                const result = await InstructorCourseModel.getInstructorCourseId(userId, courseCode);

                if (result.length === 0) {
                    return conn.rollback(() => {
                        console.error('No matching instructor_course_id found');
                        res.status(404).json({ error: 'No matching instructor_course_id found' });
                    });
                }

                const instructor_course_id = result[0].id;
                const courseName = result[0].course_name;

                const courseExists = await ChapterModel.checkCourseExists(courseCode);

                if (!courseExists) {
                    return res.status(400).json({ message: `Course with code ${courseCode} does not exist` });
                }

                await ChapterModel.insertChapter(courseCode, fileName, fileContent);

                const notificationMessage = `New Chapter added: ${courseName}`;
                await NotificationModel.createNotification(instructor_course_id, notificationMessage);

                conn.commit((err) => {
                    if (err) {
                        return conn.rollback(() => {
                            console.error('Transaction commit failed:', err);
                            res.status(500).json({error: 'Transaction commit failed'});
                        });
                    }

                    // Emit notification event
                    const notificationController = new NotificationController(io);
                    notificationController.emitNotification(userId, notificationMessage);
                    res.json({message: 'Chapter uploaded successfully'});
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

            res.setHeader('Content-Disposition', 'attachment; filename=' + chapter.chapter_name);
            res.send(chapter.chapter_content);

        } catch (error) {
            console.error('Error downloading chapter:', error);
            res.status(500).json({ error: 'An error occurred while downloading the chapter' });
        }
    }

    static async deleteChapter(req, res) {
        const chapterId = req.params.chapterId;

        try {
            await ChapterModel.deleteChapterById(chapterId);
            res.json({ message: 'Chapter deleted successfully' });

        } catch (error) {
            console.error('Error deleting chapter:', error);
            res.status(500).json({ error: 'An error occurred while deleting the chapter' });
        }
    }

    static async updateChapter(req, res) {
        const chapterId = req.params.chapterId;
        const fileName = req.file.originalname;
        const fileContent = req.file.buffer;

        try {
            await ChapterModel.updateChapter(chapterId, fileName, fileContent);
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

            res.setHeader('Content-Type', 'application/octet-stream');
            res.send(chapter.chapter_content);

        } catch (error) {
            console.error('Error viewing chapter:', error);
            res.status(500).json({ error: 'An error occurred while viewing the chapter' });
        }
    }
}

module.exports = ChapterController;
