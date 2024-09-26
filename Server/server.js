const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
const { Server } = require('socket.io');
const conn = require('./config/db');
// const createTables = require('./config/createTables');

const NotificationController = require('./controllers/NotificationController');
const answerRoutes = require('./routes/answerRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const authRoutes = require('./routes/authRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const courseRoutes = require('./routes/courseRoutes');
const departmentCourseRoutes = require('./routes/departmentCourseRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const enrollmentExamRoutes = require('./routes/enrollmentExamRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const examPreviewRoutes = require('./routes/examPreviewRoutes');
const examResultRoutes = require('./routes/examResultRoutes');
const examRoutes = require('./routes/examRoutes');
const instructorCourseExamRoutes = require('./routes/instructorCourseExamRoutes');
const instructorCourseRoutes = require('./routes/instructorCourseRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const questionRoutes = require('./routes/questionRoutes');
const studentAnswerRoutes = require('./routes/studentAnswerRoutes');
const studentAssignmentRoutes = require('./routes/studentAssignmentRoutes');
const studentExamStatusRoutes = require('./routes/studentExamStatusRoutes');
const studentMeetingRoutes = require('./routes/studentMeetingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(express.json());
app.use(cors({
    origin: ["https://college-platform.netlify.app", "http://localhost:3000"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['Authorization']
}));
app.options('*', cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Initialize NotificationController with io
const notificationController = new NotificationController(io);

// Use routes
app.use('/api', answerRoutes);
app.use('/api', assignmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', chapterRoutes);
app.use('/api', courseRoutes);
app.use('/api', departmentCourseRoutes);
app.use('/api', departmentRoutes);
app.use('/api', enrollmentExamRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api', examPreviewRoutes);
app.use('/api', examResultRoutes);
app.use('/api', examRoutes);
app.use('/api', instructorCourseExamRoutes);
app.use('/api', instructorCourseRoutes);
app.use('/api', notificationRoutes(notificationController));
app.use('/api', questionRoutes);
app.use('/api', studentAnswerRoutes);
app.use('/api', studentAssignmentRoutes);
app.use('/api', studentExamStatusRoutes);
app.use('/api', studentMeetingRoutes);
app.use('/api', userRoutes);

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
