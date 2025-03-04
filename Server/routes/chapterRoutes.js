// routes/chapterRoutes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const ChapterController = require('../controllers/ChapterController');
const { verifyToken } = require('../middlewares/auth'); // Assuming you have an auth middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Use memory storage for multer

router.get('/courses/:courseCode/chapters', verifyToken, asyncHandler(ChapterController.getChaptersByCourseCode));
router.post('/courses/:courseCode/chapters', verifyToken, upload.single('file'), asyncHandler(ChapterController.uploadChapter));
router.get('/chapters/:chapterId/download', verifyToken, asyncHandler(ChapterController.downloadChapter));
router.delete('/chapters/:chapterId', verifyToken, asyncHandler(ChapterController.deleteChapter));
router.put('/chapters/:chapterId', verifyToken, upload.single('file'), asyncHandler(ChapterController.updateChapter));//not uses
router.get('/chapters/:chapterId/view', verifyToken, asyncHandler(ChapterController.viewChapter));

module.exports = router;
