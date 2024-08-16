// routes/chapterRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const ChapterController = require('../controllers/ChapterController');
const { verifyUser } = require('../middlewares/auth'); // Assuming you have an auth middleware
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

router.get('/courses/:courseCode/chapters', verifyUser, asyncHandler(ChapterController.getChaptersByCourseCode));
router.post('/courses/:courseCode/chapters', verifyUser, upload.single('file'), asyncHandler(ChapterController.uploadChapter));
router.get('/chapters/:chapterId/download', verifyUser, asyncHandler(ChapterController.downloadChapter));
router.delete('/chapters/:chapterId', verifyUser, asyncHandler(ChapterController.deleteChapter));
router.put('/chapters/:chapterId', verifyUser, upload.single('file'), asyncHandler(ChapterController.updateChapter));
router.get('/chapters/:chapterId/view', verifyUser, asyncHandler(ChapterController.viewChapter));

module.exports = router;
