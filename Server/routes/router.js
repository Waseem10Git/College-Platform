const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const authController = require('../controllers/AuthContoller');
const userController = require('../controllers/UserController');
const accountController = require('../controllers/AccountController');
const chapterController = require('../controllers/ChapterController');
const courseController = require('../controllers/CourseController');
const instructorsCoursesController = require('../controllers/InstructorsCoursesController');
const examController = require('../controllers/ExamController');
const departmentController = require('../controllers/DepartmentController');
const enrollmentController = require('../controllers/EnrollmentController')
const asyncHandler = require('express-async-handler');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const jwtSecretKey = "13711a765c2335db1eec7192d2c46060e9719304ff5075c194923f8b7cd18ccbe6db7e4818e10e6a6bfb36ac95994657cfbfa6be7bc5a179fad55bc17a21310e"

const verifyUser = (req, res, next) => {
    const token = req.cookies.token; // Corrected to req.cookies
    if (!token) return res.status(401).json({ Error: "You are not authenticated" });
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ Error: "Token is not valid" });
        } else {
            req.user = decoded; // Attach decoded payload to req.user
            next();
        }
    });
};

// Auth
router.get('/', verifyUser, authController.authorization)
router.post('/signIn', asyncHandler(authController.signIn));
router.get('/signOut', authController.signOut)
// users
router.get("/users", asyncHandler(userController.getAllUsers))// GET ALL USERS
router.get("/user/:id", asyncHandler(userController.getUser))// GET USER BY ID
router.put('/user/update', upload.single('image'), asyncHandler(userController.updateUser));
router.post('/add-account', asyncHandler(accountController.addAccount));
router.post('/update-account', asyncHandler(accountController.updateAccount));
router.post('/delete-account', asyncHandler(accountController.deleteAccount));
// instructors-courses
router.get('/instructors-courses',asyncHandler(instructorsCoursesController.getAllInstructorsCourses))
router.post('/instructors_courses', asyncHandler(instructorsCoursesController.addInstructorToCourse));
// chapters
router.get('/courses/:courseCode/chapters', asyncHandler(chapterController.getAllChapters));
router.post('/courses/:courseCode/chapters', upload.single('file'), asyncHandler(chapterController.uploadChapter));
router.get('/chapters/:chapterId/download', asyncHandler(chapterController.downloadChapter));
router.delete('/chapters/:chapterId', asyncHandler(chapterController.deleteChapter));
router.put('/chapters/:chapterId', upload.single('file'), asyncHandler(chapterController.updateChapter));
router.get('/chapters/:chapterId/view', asyncHandler(chapterController.viewChapter));
// enrollments
router.post('/enrollments', asyncHandler(enrollmentController.addStudentToCourse));
// departments
router.get('/', asyncHandler(departmentController.getAllDepartments));
router.post('/', asyncHandler(departmentController.addDepartment));
router.delete('/:id', asyncHandler(departmentController.deleteDepartment));
router.post('/:id/levels', asyncHandler(departmentController.addLevelToDepartment));
router.delete('/:id/levels', asyncHandler(departmentController.deleteLevelFromDepartment));
// departments-courses
router.get('/courses')// Get courses of department
// courses
router.get('/courses', asyncHandler(courseController.getAllCourses));
router.post('/courses', asyncHandler(courseController.addCourse));
router.put('/courses/:id', asyncHandler(courseController.updateCourse));
router.delete('/courses/:id', asyncHandler(courseController.deleteCourse));
router.get('/student/:id/courses', asyncHandler(courseController.getStudentCourses));
router.get('/instructor/:id/courses', asyncHandler(courseController.getInstructorCourses));
// exams
router.post('/instructorsCoursesExams', asyncHandler(examController.associateExamWithCourse));
router.post('/exams', asyncHandler(examController.createExam));
router.post('/questions', asyncHandler(examController.addQuestion));
router.post('/answers', asyncHandler(examController.addAnswer));
module.exports = router;