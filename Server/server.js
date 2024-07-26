const cookieParser = require('cookie-parser');
const multer = require('multer');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs')
// const route = require('./routes/router');
const conn = require('./config/db');
const path = require("path");
const util = require("util");
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: '*',  // Allow all origins for CORS
        methods: ['GET', 'POST']
    }
});


const saltRounds  = 10;
const jwtSecretKey = "13711a765c2335db1eec7192d2c46060e9719304ff5075c194923f8b7cd18ccbe6db7e4818e10e6a6bfb36ac95994657cfbfa6be7bc5a179fad55bc17a21310e"

app.use(express.json());
// app.use('/api',route);
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", 'DELETE', 'PUT'],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));



// ---------------------------------------------------------------------- Middleware to authenticate user
const verifyUser = (req, res, next) => {
    const token = req.cookies.token; // Corrected to req.cookies
    if (!token) return res.json({ Error: "You are not authenticated" });
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
        if (err) {
            return res.json({ Error: "Token is not valid" });
        } else {
            req.user = decoded; // Attach decoded payload to req.user
            next();
        }
    });
};
// Authorization
app.get('/', verifyUser, (req, res) => {
    const { firstName, role, id } = req.user;
    return res.json({ Status: "Success", firstName, role, id });
});

// ---------------------------------------------------------------------- SIGNE IN
app.post('/signIn', (req, res) => {
    const { email, password } = req.body;

    conn.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.json({ Error: "Login error" });
        if (results.length > 0) {
            bcrypt.compare(password.toString(), results[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const { first_name: firstName, role: role, id: id } = results[0]; // Ensure correct property name
                    // console.log("User firstName:", firstName); // Debugging statement
                    const token = jwt.sign({ firstName, role, id }, jwtSecretKey, { expiresIn: "5d" });
                    res.cookie('token', token);
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            });
        } else {
            return res.json({ Error: "No email existed" });
        }
    });
});

// ---------------------------------------------------------------------- SING OUT
app.get('/signOut', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
})




// ---------------------------------------------------------------------- Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};



// ---------------------------------------------------------------------- USERS

// GET USER BY ID
app.get("/user/:id", (req, res) => {
    const userID = req.params.id
    const sql = "SELECT * FROM users WHERE id = ?";
    conn.query(sql,[userID], (err, result)=>{
        if (err) res.json({message:"Server Error"});
        return res.json(result[0]);
    });
});

// UPDATE USER DATA
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

app.put('/user/update', upload.single('image'), async (req, res) => {
    const { password, userId } = req.body;
    const image = req.file;

    try {
        const updatePromises = [];

        if (password) {
            const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
            updatePromises.push(
                new Promise((resolve, reject) => {
                    conn.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
                        if (err) {
                            console.error("Error updating password:", err);
                            reject("Error updating password");
                        } else {
                            resolve();
                        }
                    });
                })
            );
        }

        if (image) {
            const imageData = image.buffer;
            updatePromises.push(
                new Promise((resolve, reject) => {
                    conn.query('UPDATE users SET image = ? WHERE id = ?', [imageData, userId], (err, result) => {
                        if (err) {
                            console.error("Error updating image:", err);
                            reject("Error updating image");
                        } else {
                            resolve();
                        }
                    });
                })
            );
        }

        // Wait for all update queries to complete
        await Promise.all(updatePromises);

        // Send a success response
        res.json({ Status: "Success", Message: "User updated successfully" });

    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ Status: "Error", Error: "Error updating user profile" });
    }
});


// GET ALL USERS (FOR ADMIN)
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    conn.query(sql, (err, result)=>{
        if (err) res.json({message:"Server Error"});
        return res.json(result);
    });
});

// GET ALL INSTRUCTORS (FOR ADMIN)
app.get("/api/instructors", (req, res) => {
    const sql = "SELECT * FROM users WHERE role = ?";
    const value = "instructor";
    conn.query(sql, [value], (err, result)=>{
        if (err) res.json({message:"Server Error in GET Instructors with endpoint: /instructors"});
        return res.json(result);
    });
});

// GET ALL students (FOR ADMIN)
app.get("/api/students", (req, res) => {
    const sql = "SELECT * FROM users WHERE role = ?";
    const value = "student";
    conn.query(sql, [value], (err, result)=>{
        if (err) res.json({message:"Server Error in GET Students with endpoint: /students"});
        return res.json(result);
    });
});


// ---------------------------------------------------------------------- COURSES
// GET ALL COURSES AND INSTRUCTORS
app.get("/instructors-courses", (req, res)=>{
    const sql = `
    SELECT U.first_name, U.last_name, U.email, C.course_code, C.course_name FROM users AS U 
    INNER JOIN instructors_courses AS IC ON U.id = IC.instructor_id
    INNER JOIN departments_courses AS DC ON IC.department_course_id = DC.id
    INNER JOIN courses AS C ON DC.course_id = C.course_code
    `;
    conn.query(sql, (err, result)=>{
        if (err) return res.json({Error: "get data Error in server: /instructors-courses"});
        return res.json(result);
    });
});

app.get("/api/instructor-courses-departments", (req, res)=>{
    const sql = `SELECT * FROM courses as C
    INNER JOIN 
    `;
    conn.query(sql, (err, result)=>{
        if (err) return res.json({Error: "Inserting data Error in server"});
        return res.json(result);
    });
});

// // Assuming you have a chapters table with a course_id foreign key
// app.get("/chapters/:courseId", (req, res) => {
//     const courseId = req.params.course_code; // Get course ID from route parameter
//
//     const sql = "SELECT * FROM chapters WHERE course_id = ?"; // Query chapters for specific course
//
//     conn.query(sql, [courseId], (err, result) => {
//         if (err) return res.json({ message: "Server Error" });
//         return res.json(result); // Send chapters data as JSON response
//     });
// });

// API to get all courses for a students
app.get('/api/student/:id/courses', (req, res) => {
    const userId = req.params.id;
    const query = `
    SELECT C.course_code, C.course_name, C.description
    FROM courses AS C 
    INNER JOIN departments_courses AS DC ON C.course_code = DC.course_id
    INNER JOIN instructors_courses as IC ON DC.id = IC.department_course_id
    INNER JOIN enrollments AS E ON E.instructor_course_id = IC.id
    WHERE E.student_id = ?
    `;
    conn.query(query, [userId], (err, results) => {
        if (err) throw err;
        console.log("results: ", results)
        res.json(results);
    });
});


// API to get all courses for an instructor
app.get('/api/instructor/:id/courses', (req, res) => {
    const userId = req.params.id;
    console.log("userId: " ,userId)
    const query = `
    SELECT C.course_code, C.course_name, C.description 
    FROM instructors_courses AS IC 
    INNER JOIN departments_courses as DC ON IC.department_course_id = DC.id
    INNER JOIN courses AS C ON C.course_code = DC.course_id 
    WHERE IC.instructor_id = ?
    `;
    conn.query(query, [userId], (err, results) => {
        if (err) throw err;
        console.log("results: ", results)
        res.json(results);
    });
});



// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be uploaded
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});
const Upload = multer({ storage: storage });

// POST endpoint to handle assignment upload
app.post('/upload-assignment', Upload.single('assignmentFile'), (req, res) => {
    const { selectedCourse, userId, assignmentName, assignmentDescription, dueDate } = req.body;
    const assignmentFile = req.file;

    const filePath = path.join(__dirname, assignmentFile.path);
    const fileData = fs.readFileSync(filePath);

    conn.beginTransaction(err => {
        if (err) {
            console.error('Transaction Error:', err);
            return res.status(500).json({ error: 'Transaction Error' });
        }

        const getInstructorCourseId = `
        SELECT IC.id, C.course_name 
        FROM instructors_courses as IC
        INNER JOIN departments_courses as DC ON IC.department_course_id = DC.id
        INNER JOIN courses as C ON DC.course_id = C.course_code
        WHERE IC.instructor_id = ? AND DC.course_id = ?
        `;

        conn.query(getInstructorCourseId, [userId, selectedCourse], (error, result) => {
            if (error) {
                return conn.rollback(() => {
                    console.error('Error to get instructor_course_id:', error);
                    res.status(500).json({ error: 'Failed to get instructor_course_id' });
                });
            }

            if (result.length === 0) {
                return conn.rollback(() => {
                    console.error('No matching instructor_course_id found');
                    res.status(404).json({ error: 'No matching instructor_course_id found' });
                });
            }

            const instructor_course_id = result[0].id;
            const courseName = result[0].course_name;

            const insertAssignmentQuery = `
            INSERT INTO assignments (assignment_title, description, assignment_file_name, assignment_file, due_date)
            VALUES (?, ?, ?, ?, ?)
            `;

            conn.query(insertAssignmentQuery, [assignmentName, assignmentDescription, assignmentFile.originalname, fileData, dueDate], (error, result) => {
                if (error) {
                    return conn.rollback(() => {
                        console.error('Error uploading assignment:', error);
                        res.status(500).json({ error: 'Failed to upload assignment' });
                    });
                }

                const assignmentId = result.insertId;

                const insertInstructorsCoursesAssignmentsQuery = `
                INSERT INTO instructors_courses_assignments (instructor_course_id, assignment_id)
                VALUES (?, ?)
                `;

                conn.query(insertInstructorsCoursesAssignmentsQuery, [instructor_course_id, assignmentId], (error) => {
                    if (error) {
                        return conn.rollback(() => {
                            console.error('Error inserting into instructors_courses_assignments:', error);
                            res.status(500).json({ error: 'Failed to associate assignment with course' });
                        });
                    }

                    const notificationMessage = `New Assignment added: ${courseName}`;
                    const notificationSql = 'INSERT INTO notifications (instructor_course_id, message, is_read) VALUES (?, ?, 0)';

                    conn.query(notificationSql, [instructor_course_id	, notificationMessage], (error) => {
                        if (error) {
                            return conn.rollback(() => {
                                console.error('Error inserting notification:', error);
                                res.status(500).json({ error: 'Failed to create notification' });
                            });
                        }

                        conn.commit(err => {
                            if (err) {
                                return conn.rollback(() => {
                                    console.error('Transaction commit failed:', err);
                                    res.status(500).json({ error: 'Transaction commit failed' });
                                });
                            }

                            // Emit notification event
                            io.emit('notification', { userId, message: notificationMessage });
                            console.log('Assignment uploaded successfully');
                            res.json({ message: 'Assignment uploaded successfully' });

                            // Cleanup: delete the temporary file after storing in database
                            try {
                                fs.unlinkSync(filePath);
                            } catch (unlinkError) {
                                console.error('Error deleting temporary file:', unlinkError);
                            }
                        });
                    });
                });
            });
        });
    });
});

const unlinkAsync = util.promisify(fs.unlink);
const queryAsync = util.promisify(conn.query).bind(conn);

app.post('/upload-student-assignment', upload.single('file'), async (req, res) => {
    const { courseId, assignmentId, userId, instructorCourseId } = req.body;
    const studentFile = req.file;
    console.log("student file", studentFile)

    try {
        const getEnrollmentId = `
        SELECT id FROM enrollments 
        WHERE student_id = ? AND instructor_course_id = ?
        `;
        const enrollmentResult = await queryAsync(getEnrollmentId, [userId, instructorCourseId]);

        if (enrollmentResult.length === 0) {
            return res.status(404).json({ error: 'No matching enrollment found' });
        }

        const enrollmentId = enrollmentResult[0].id;

        // Read the file
        const fileData = studentFile.buffer;

        // Insert student file into database
        const insertStudentFileQuery = `
        INSERT INTO enrollments_assignments (enrollment_id, assignment_id, student_file, student_file_name)
        VALUES (?, ?, ?, ?)
         `;
        await queryAsync(insertStudentFileQuery, [enrollmentId, assignmentId, fileData, studentFile.originalname]);

        console.log('Student assignment uploaded successfully');
        res.json({ message: 'Assignment uploaded successfully' });


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred during the upload process' });

        // Attempt to delete the file if an error occurs
        try {
            await unlinkAsync(filePath);
        } catch (unlinkError) {
            console.error('Error deleting temporary file:', unlinkError);
        }
    }
});

// Get assignments for a specific course
app.get('/assignments/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const query = `
    SELECT a.assignment_id, a.assignment_title, a.description, ica.instructor_course_id
    FROM assignments a
    JOIN instructors_courses_assignments ica ON a.assignment_id = ica.assignment_id
    JOIN instructors_courses ic ON ica.instructor_course_id = ic.id
    JOIN departments_courses dc ON ic.department_course_id = dc.id 
    WHERE dc.course_id = ?
  `;
    conn.query(query, [courseId], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});
//
// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });
// const Upload = multer({ storage: storage });
//
// // Handle file upload
// app.post('/upload-assignment', Upload.single('file'), (req, res) => {
//     const { courseId, assignmentId } = req.body;
//     const file = req.file;
//
//     // Read the uploaded file
//     const filePath = path.join(__dirname, file.path);
//     const fileData = fs.readFileSync(filePath);
//
//     // Store file in database as LONGBLOB
//     const insertQuery = `
//     INSERT INTO submitted_assignments (course_id, assignment_id, file_data)
//     VALUES (?, ?, ?)
//   `;
//     conn.query(insertQuery, [courseId, assignmentId, fileData], (error, result) => {
//         if (error) {
//             console.error('Error storing file in database:', error);
//             res.status(500).json({ error: 'Failed to store file in database' });
//         } else {
//             console.log('File stored in database:', result);
//             res.json({ message: 'File uploaded successfully', file: file });
//         }
//     });
//
//     // Cleanup: delete the temporary file after storing in database
//     fs.unlinkSync(filePath);
// });
//
//
// API to get all chapters for a course
app.get('/api/courses/:courseCode/chapters', (req, res) => {
    const courseCode = req.params.courseCode;
    const query = 'SELECT id, chapter_name FROM chapters WHERE course_id = ?';
    conn.query(query, [courseCode], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// // Endpoint to upload a file
// app.post('/api/courses/:courseCode/chapters', upload.single('file'), (req, res) => {
//     const { courseCode } = req.params;
//     const file = req.file;
//
//     if (!file) {
//         return res.status(400).send('No file uploaded.');
//     }
//
//     const query = 'INSERT INTO chapters (chapter_name, chapter_content, course_id) VALUES (?, ?, ?)';
//     conn.query(query, [Buffer.from(file.originalname, 'utf8').toString('binary'), file.buffer, courseCode], (err, results) => {
//         if (err) {
//             console.error('Error inserting file into database:', err);
//             return res.status(500).send(err);
//         }
//         res.send('File uploaded successfully');
//     });
// });
//
// // Endpoint to download a file
// app.get('/api/chapters/:chapterId/download', (req, res) => {
//     const { chapterId } = req.params;
//
//     const query = 'SELECT chapter_name, chapter_content FROM chapters WHERE id = ?';
//     conn.query(query, [chapterId], (err, results) => {
//         if (err || results.length === 0) {
//             console.error('Error fetching file from database:', err);
//             return res.status(404).send('File not found.');
//         }
//
//         const fileName = Buffer.from(results[0].chapter_name, 'binary').toString('utf8');
//         const fileContent = results[0].chapter_content;
//
//         res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`);
//         res.setHeader('Content-Type', 'application/octet-stream');
//         res.send(fileContent);
//     });
// });

const MAX_LONG_BLOB_SIZE = 4 * 1024 * 1024 * 1024; // 4GB

// API to upload chapters to a course
app.post('/api/courses/:courseCode/chapters', upload.single('file'), (req, res) => {
    const courseCode = req.params.courseCode;
    const fileName = req.file.originalname;
    const fileContent = req.file.buffer;

    if (req.file.size > MAX_LONG_BLOB_SIZE) {
        return res.status(400).json({
            message: `File is too large. Maximum size allowed is ${MAX_LONG_BLOB_SIZE / (1024 * 1024)} MB`
        });
    }
    console.log(courseCode)
    const checkCourseQuery = 'SELECT * FROM courses WHERE course_code = ?';
    conn.query(checkCourseQuery, [courseCode], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: `Course with code ${courseCode} does not exist` });
        }

        const insertChapterQuery = 'INSERT INTO chapters (course_id, chapter_name, chapter_content) VALUES (?, ?, ?)';
        conn.query(insertChapterQuery, [courseCode, fileName, fileContent], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            res.json({ message: 'Chapter uploaded successfully', fileName });
        });
    });
});

// API to download a chapter
app.get('/api/chapters/:chapterId/download', (req, res) => {
    const chapterId = req.params.chapterId;
    const query = 'SELECT chapter_name, chapter_content FROM chapters WHERE id = ?';
    conn.query(query, [chapterId], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).send('File not found');
        }
        const file = results[0];
        res.setHeader('Content-Disposition', 'attachment; filename=' + file.chapter_name);
        res.send(file.chapter_content);
    });
});

// API to delete a chapter
app.delete('/api/chapters/:chapterId', (req, res) => {
    const chapterId = req.params.chapterId;
    const query = 'DELETE FROM chapters WHERE id = ?';
    conn.query(query, [chapterId], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Chapter deleted successfully' });
    });
});

// API to modify a chapter
app.put('/api/chapters/:chapterId', upload.single('file'), (req, res) => {
    const chapterId = req.params.chapterId;
    const fileName = req.file.originalname;
    const fileContent = req.file.buffer;
    const query = 'UPDATE chapters SET chapter_name = ?, chapter_content = ? WHERE id = ?';
    conn.query(query, [fileName, fileContent, chapterId], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Chapter updated successfully', fileName });
    });
});

// API to view a chapter (serve the file content)
app.get('/api/chapters/:chapterId/view', (req, res) => {
    const chapterId = req.params.chapterId;
    const query = 'SELECT chapter_name, chapter_content FROM chapters WHERE id = ?';
    conn.query(query, [chapterId], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).send('File not found');
        }
        const file = results[0];
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(file.chapter_content);
    });
});

// const upload = multer({ dest: 'uploads/' });  // Configure upload destination (optional)
//
// app.post('/upload-chapter', upload.single('pdfFile'), (req, res) => {
//     const pdfBuffer = fs.readFileSync(req.file.path);  // Read uploaded file as buffer
//
//     const sql = 'INSERT INTO chapters (chapter_name, chapter_title, course_id, pdf_blob) VALUES (?, ?, ?, ?)';
//     const values = [req.body.chapterName, req.body.chapterTitle, req.body.courseId, pdfBuffer];
//
//     conn.query(sql, values, (err, result) => {
//         if (err) return res.json({ error: err.message });
//         return res.json({ message: 'Chapter uploaded successfully!' });
//     });
// });

// ---------------------------------------------------------------------- Department
// 1-GET ALL DEPARTMENTS
app.get("/api/departments", (req, res) => {
    const sql = "SELECT * FROM departments";
    conn.query(sql, (err, result)=>{
        if (err) res.json({message:"Server Error", err});
        return res.json(result);
    });
});

// 2-Add a new department
app.post('/api/departments', (req, res) => {
    const { department_name } = req.body;
    const sql = 'INSERT INTO departments ( department_name ) VALUES (?)';
    conn.query(sql, [department_name], (err, results) => {
        if (err) {
            return res.json({ message: "Server Error", err });
        }
        res.json({ success: true });
    });
});

// 3-Update a department
app.put('/api/departments/:id', (req, res) => {
    const { id } = req.params;
    const { department_name } = req.body;
    const sql = 'UPDATE departments SET department_name = ? WHERE department_id = ?';
    conn.query(sql, [department_name, id], (err, results) => {
        if (err) res.json({message:"Server Error", err});
        res.json({ success: true });
    });
});

// 3-Delete a department
app.delete('/api/departments/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM departments WHERE department_id = ?';
    conn.query(sql, [id], (err, results) => {
        if (err) res.json({message:"Server Error", err});
        res.json({ success: true });
    });
});

// 4-Add a level to a department
app.post('/api/departments/:id/levels', (req, res) => {
    const { id } = req.params;
    const { level, semester } = req.body;
    const sql = 'INSERT INTO departments_courses (department_id, level, semester) VALUES (?, ?, ?)';
    conn.query(sql, [id, level, semester], (err, results) => {
        if (err) res.json({message:"Server Error", err});
        res.json({ success: true });
    });
});

// 5-Delete a level
app.delete('/api/departments/:id/levels', (req, res) => {
    const { id } = req.params;
    const { level } = req.body;
    const sql = 'DELETE FROM departments_courses WHERE department_id = ? AND level = ?';
    conn.query(sql, [id, level], (err, results) => {
        if (err) res.json({message:"Server Error", err});
        res.json({ success: true });
    });
});

// ---------------------------------------------------------------------- Courses
// 6-Endpoint to get all courses according to instructor_id
app.get('/api/courses/:id', (req, res) => {
    const {id} = req.params;
    const sql = `
    SELECT C.course_code, C.course_name FROM courses as C
    INNER JOIN departments_courses as DC ON C.course_code = DC.course_id
    INNER JOIN instructors_courses as IC ON IC.department_course_id = DC.id
    INNER JOIN users as U ON IC.instructor_id = U.id
    WHERE U.id = ?
    `;
    conn.query(sql, [id], (err, results) => {
        if (err) res.json({message:"Server Error", err});
        res.send(results);
    });
});

// 7-Add a course
app.post('/api/courses', upload.single('image'), (req, res) => {
    const { id, name, description } = req.body;
    const image = req.file ? req.file.buffer : null;

    const courseQuery = 'INSERT INTO courses (course_code, course_name, description, image) VALUES (?, ?, ?, ?)';
    conn.query(courseQuery, [id, name, description, image], (err, results) => {
        if (err) {
            console.error('Error inserting into courses:', err);
            return res.status(500).send(err);
        }

        res.send({ success: true });
    });
});

// 8-Update a course
app.put('/api/courses/:id', upload.single('file'), (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? req.file.buffer : null;
    const { id } = req.params;

    let updateCourseQuery = 'UPDATE courses SET ';
    const updateValues = [];
    if (name) {
        updateCourseQuery += 'course_name = ?, ';
        updateValues.push(name);
    }
    if (description) {
        updateCourseQuery += 'description = ?, ';
        updateValues.push(description);
    }
    if (image) {
        updateCourseQuery += 'image = ?, ';
        updateValues.push(image);
    }
    updateCourseQuery = updateCourseQuery.slice(0, -2); // Remove last comma
    updateCourseQuery += ' WHERE course_code = ?';
    updateValues.push(id);

    conn.query(updateCourseQuery, updateValues, (err, results) => {
        if (err) {
            console.error('Error updating courses:', err);
            return res.status(500).send(err);
        }

        res.send({ success: true });
    });
});

// 9-Delete a course
app.delete('/api/courses/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM courses WHERE course_code = ?';
    conn.query(sql, [id], (err, results) => {
        if (err) res.json({message:"Server Error", err});
        res.json({ success: true });
    });
});

// 10-Add an instructor to a course (updated)
app.post('/api/instructors-enrollments', (req, res) => {
    const { instructor_id, department_course_ids } = req.body;
    const sql = 'INSERT INTO instructors_courses (instructor_id, department_course_id) VALUES (?, ?)';

    department_course_ids.forEach(id => {
        conn.query(sql, [instructor_id, id], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Already added' });
                } else {
                    console.error('Error inserting into instructors_courses:', err);
                    return res.status(500).send(err);
                }
            }
        });
    })

    res.json({ success: true });
});
// delete (new)
app.delete('/api/instructors-enrollments/:id', (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const sql = 'DELETE FROM instructors_courses WHERE id = ?';

    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error deleting instructor-course relation:', err);
            return res.status(500).send(err);
        }

        res.json({ success: true });
    });
});

// 11-Add a student to a course
app.post('/api/enrollments', (req, res) => {
    const { student_id, course_id } = req.body;
    const sql = 'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)';
    conn.query(sql, [student_id, course_id], (err, results) => {
        if (err) res.json({message:"Server Error", err});
        res.json({ success: true });
    });
});


// Add a student to a course (new)
app.get('/api/students-enrollments', (req, res) => {
    const sql = `
    SELECT su.id, su.first_name as student_fname, su.last_name as student_lname, e.id, c.course_code, c.course_name, d.department_name, iu.first_name as instructor_fname, iu.last_name as instructor_lname
    FROM users as su
    INNER JOIN enrollments as e ON su.id = e.student_id
    INNER JOIN instructors_courses as ic ON e.instructor_course_id = ic.id
    INNER JOIN users as iu ON ic.instructor_id = iu.id
    INNER JOIN departments_courses as dc ON ic.department_course_id = dc.id
    INNER JOIN courses as c ON dc.course_id = c.course_code
    INNER JOIN departments as d ON dc.department_id = d.department_id
    `;

    conn.query(sql, (err, result) => {
        if (err) res.json({message:"Server Error: GET from enrollments"});
        return res.json(result);
    });
});

// POST
app.post('/api/students-enrollments', (req, res) => {
    const { student_id, instructor_course_ids } = req.body;
    const sql = 'INSERT INTO enrollments (student_id, instructor_course_id) VALUES (?, ?)';

    instructor_course_ids.forEach(id => {
        conn.query(sql, [student_id, id], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Already added' });
                } else {
                    console.error('Error inserting into instructors_courses:', err);
                    return res.status(500).send(err);
                }
            }
        });
    })

    res.json({ success: true });
});

// delete (new)
app.delete('/api/students-enrollments/:id', (req, res) => {
    const { id } = req.params;
    // console.log(id)
    const sql = 'DELETE FROM enrollments WHERE id = ?';

    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error deleting instructor-course relation:', err);
            return res.status(500).send(err);
        }

        res.json({ success: true });
    });
});

// ---------------------------------------------------------------------- Enrollments
// 12-GET ALL ENROLLMENTS
app.get("/enrollments", (req, res) => {
    const sql = "SELECT * FROM enrollments";
    conn.query(sql, (err, result)=>{
        if (err) res.json({message:"Server Error"});
        return res.json(result);
    });
});
// 13-GET ALL INSTRUCTORS-COURSES
app.get("/api/instructors-courses", (req, res)=>{
    const sql = "SELECT * FROM instructors_courses";
    conn.query(sql, (err, result)=>{
        if (err) res.json({ message: "Server Error" });
        return res.json(result);
    })
})

// Get all students for a course
app.get('/api/enrollments/:courseId/:userId', (req, res) => {
    const { courseId, userId } = req.params;
    // Implement your SQL query to fetch enrollments for the courseId
    const query = `
        SELECT u.id, u.first_name, u.last_name, u.email
        FROM enrollments e
        JOIN instructors_courses ic ON e.instructor_course_id = ic.id
        JOIN departments_courses dc ON ic.department_course_id = dc.id
        JOIN users u ON e.student_id = u.id
        WHERE dc.course_id = ? AND ic.instructor_id = ?
    `;
    conn.query(query, [courseId, userId], (err, results) => {
        if (err) {
            console.error('Error fetching enrollments:', err);
            return res.status(500).send({ message: 'Error fetching enrollments' });
        }
        res.status(200).json(results);
    });
});

// Get students with them assignments
app.get('/api/assignments/:assignmentId/students', (req, res) => {
    const { assignmentId } = req.params;
    // Implement your SQL query to fetch students with their assignments
    const query = `
        SELECT u.id, u.first_name, u.last_name, ea.student_file_name AS assignment_file_name, ea.student_file AS assignment_file, ea.created_at AS uploaded_at, ea.score
        FROM enrollments_assignments ea
        RIGHT JOIN enrollments e ON ea.enrollment_id = e.id
        JOIN instructors_courses ic ON e.instructor_course_id = ic.id
        JOIN instructors_courses_assignments ica ON ic.id = ica.instructor_course_id
        RIGHT JOIN users u ON e.student_id = u.id
        WHERE ica.assignment_id = ? 
    `;
    conn.query(query, [assignmentId], (err, results) => {
        if (err) {
            console.error('Error fetching assignments:', err);
            return res.status(500).send({ message: 'Error fetching assignments' });
        }
        res.status(200).json(results);
    });
});

// Assuming you have a route setup for exam results by examId
app.get('/api/exam-results/:examId', (req, res) => {
    const { examId } = req.params;
    // Implement your SQL query to fetch students with their exam results
    const query = `
        SELECT u.id, u.first_name, u.last_name, ee.score, ee.is_submitted
        FROM enrollments_exams ee
        JOIN enrollments e ON ee.enrollment_id = e.id
        RIGHT JOIN users u ON e.student_id = u.id
        WHERE ee.exam_id = ?
    `;
    conn.query(query, [examId], (err, results) => {
        if (err) {
            console.error('Error fetching exam results:', err);
            return res.status(500).send({ message: 'Error fetching exam results' });
        }
        res.status(200).json(results);
    });
});



app.get("/api/instructors-departments-courses", (req, res)=>{
    const sql = `
    SELECT u.id as user_id, u.first_name, u.last_name, ic.id as instructor_course_id, ic.department_course_id, c.course_code, c.course_name, d.department_name
    FROM users as u
    INNER JOIN instructors_courses as ic on u.id = ic.instructor_id
    INNER JOIN departments_courses as dc on dc.id = ic.department_course_id
    INNER JOIN courses as c on dc.course_id = c.course_code
    INNER JOIN departments as d on dc.department_id = d.department_id
    `;
    conn.query(sql, (err, result)=>{
        if (err) res.json({ message: "Server Error: get instructors-departments-courses data" });
        return res.json(result);
    })
})

// departments-courses get all (new)
app.get('/api/departments-courses', (req, res) => {
    const sql = `
    SELECT d.department_id, d.department_name, dc.id, dc.level, dc.semester, c.course_code, c.course_name
    FROM departments as d 
    INNER JOIN departments_courses as dc ON d.department_id = dc.department_id
    INNER JOIN courses as c ON dc.course_id = c.course_code
    `;
    conn.query(sql, (err, result) => {
        if (err) res.json({ message: "Server Error ON GET departments-courses" });
        return res.json(result);
    })
})

// add to departments-courses (new)
app.post('/api/departments-courses', (req, res) => {
    const { department_id, course_id, level, semester } = req.body;
    const query = 'INSERT INTO departments_courses (department_id, course_id, level, semester) VALUES (?, ?, ?, ?)';
    conn.query(query, [department_id, course_id, level, semester], (err, results) => {
        if (err) {
            console.error('Error inserting into departments-courses:', err);
            return res.status(500).send(err);
        }
        res.send({ success: true });
    });
});
// update to departments-courses (new)
app.put('/api/departments-courses/:id', (req, res) => {
    const { id } = req.params;
    const { department_id, course_id, level, semester } = req.body;
    const fields = [];

    if (department_id !== undefined) fields.push(`department_id = '${department_id}'`);
    if (course_id !== undefined) fields.push(`course_id = '${course_id}'`);
    if (level !== undefined) fields.push(`level = ${level}`);
    if (semester !== undefined) fields.push(`semester = ${semester}`);

    const query = `UPDATE departments_courses SET ${fields.join(', ')} WHERE id = ?`;
    conn.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error updating departments-courses:', err);
            return res.status(500).send(err);
        }
        res.send({ success: true });
    });
});

// delete from departments-courses (new)
app.delete('/api/departments-courses/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM departments_courses WHERE id = ?';
    conn.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting from departments-courses:', err);
            return res.status(500).send(err);
        }
        res.send({ success: true });
    });
});

// ---------------------------------------------------------------------- ADDING/MODIFYING/DELETING ACCOUNTS
// ADD ACCOUNT (ADMIN VIEW)
// app.post("/add-account", (req, res) => {
//     const sql = "INSERT INTO users (first_name, middle_name, last_name, email, password, role, department_id) VALUES (?, (SELECT department_id FROM departments WHERE department_name = ?))";
//     bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
//         if (err) {
//             console.error("Error for hashing password:", err);
//             return res.json({ Status: "Error", Error: "Error for hashing password" });
//         }
//         const values = [
//             req.body.firstName,
//             req.body.middleName,
//             req.body.lastName,
//             req.body.email,
//             hash,
//             req.body.role,
//         ];
//         conn.query(sql, [values, departmentName], (err, result) => {
//             if (err) {
//                 console.error("Inserting data Error in server:", err);
//                 return res.json({ Status: "Error", Error: "Inserting data Error in server" });
//             }
//             return res.json({ Status: "Success" });
//         });
//     });
// });
app.post("/add-account", (req, res) => {
    const sql = `INSERT INTO users (first_name, middle_name, last_name, email, password, role, department_id)
                 VALUES (?, ?, ?, ?, ?, ?, (SELECT department_id FROM departments WHERE department_name = ?))`;

    const { firstName, middleName, lastName, email, password, role, departmentName } = req.body;

    bcrypt.hash(password.toString(), saltRounds, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.json({ Status: "Error", Error: "Error hashing password" });
        }

        const values = [firstName, middleName, lastName, email, hash, role, departmentName];

        conn.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.json({ Status: "Error", Error: "Error inserting data" });
            }
            return res.json({ Status: "Success" });
        });
    });
});

// // UPDATE ACCOUNT (ADMIN VIEW)
// app.post("/update-account", (req, res) => {
//     const firstName = req.body.newFirstName;
//     const middleName = req.body.newMiddleName;
//     const lastName = req.body.newLastName;
//     const email = req.body.newEmail;
//     const password = req.body.newPassword;
//     const id = req.body.userID;
//     const sql = "UPDATE users SET first_name=?, middle_name=?, last_name=?, email=?, password=? WHERE id=?";
//     conn.query(sql, [firstName, middleName, lastName, email, password, id], (err, result) => {
//         if (err) return res.json({Error: "Deleting data Error in server"});
//         return res.json({Status: "Success"});
//     })
// });
app.post("/update-account", (req, res) => {
    const { newFirstName, newMiddleName, newLastName, newEmail, newPassword, userID } = req.body;

    // Check which fields are provided
    const fields = [];
    const values = [];

    if (newFirstName) {
        fields.push("first_name = ?");
        values.push(newFirstName);
    }
    if (newMiddleName) {
        fields.push("middle_name = ?");
        values.push(newMiddleName);
    }
    if (newLastName) {
        fields.push("last_name = ?");
        values.push(newLastName);
    }
    if (newEmail) {
        fields.push("email = ?");
        values.push(newEmail);
    }
    if (newPassword) {
        // If new password is provided, hash it before updating
        bcrypt.hash(newPassword.toString(), salt, (err, hash) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.json({ Status: "Error", Error: "Error hashing password" });
            }
            fields.push("password = ?");
            values.push(hash);
            // Add user ID to the values array for the WHERE clause
            values.push(userID);

            // Construct the SQL query
            const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
            conn.query(sql, values, (err, result) => {
                if (err) {
                    console.error("Error updating data:", err);
                    return res.json({ Status: "Error", Error: "Error updating data" });
                }
                return res.json({ Status: "Success" });
            });
        });
        return; // Exit the function to avoid double response
    }

    // Add user ID to the values array for the WHERE clause
    values.push(userID);

    // Construct the SQL query
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating data:", err);
            return res.json({ Status: "Error", Error: "Error updating data" });
        }
        return res.json({ Status: "Success" });
    });
});



// DELETE ACCOUNT (ADMIN VIEW)
app.post("/delete-account", (req, res) => {
    const id = req.body.userID;
    const sql = "DELETE FROM users WHERE id=?";
    conn.query(sql, [id], (err, result) => {
        if (err) return res.json({Error: "Deleting data Error in server"});
        return res.json({Status: "Success"});
    });
});


// ADMIN VIEW ADDING & REMOVING COURSE , STUDENTS & INSTRUCTORS
// get all courses for add new course page (admin)
app.get('/api/courses', (req, res) => {
    const departmentId = req.query.department_id;
    const query = `
      SELECT * FROM courses
    `;
    conn.query(query, [departmentId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/courses', (req, res) => {
    const { departmentId, courseCode, courseName, description } = req.body;
    console.log('Received course data:', { departmentId, courseCode, courseName, description });

    if (!departmentId || !courseCode || !courseName || !description) {
        console.error('Missing required fields:', { departmentId, courseCode, courseName, description });
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert into courses table
    const courseInsertQuery = 'INSERT INTO courses (course_code, course_name, description) VALUES (?, ?, ?)';
    conn.query(courseInsertQuery, [courseCode, courseName, description], (err, result) => {
        if (err) {
            console.error('Error inserting course:', err);
            res.status(500).json({ error: 'Error inserting course' });
            return;
        }

        // Insert into departments_courses table
        const departmentsCoursesInsertQuery = 'INSERT INTO departments_courses (department_id, course_id) VALUES (?, ?)';
        conn.query(departmentsCoursesInsertQuery, [departmentId, courseCode], (err) => {
            if (err) {
                console.error('Error inserting course-department relationship:', err);
                res.status(500).json({ error: 'Error inserting course-department relationship' });
                return;
            }

            res.status(201).json({ message: 'Course added successfully' });
        });
    });
});



app.delete('/api/courses/:course_code', (req, res) => {
    const course_code = req.params.course_code;
    const query = 'DELETE FROM courses WHERE course_code = ?';
    conn.query(query, [course_code], (err, result) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});
//?
app.post('/api/instructors-courses', (req, res) => {
    const { instructorEmail, courseCodes } = req.body;
    const query = 'SELECT id FROM users WHERE email = ?';
    conn.query(query, [instructorEmail], (err, results) => {
        if (err) throw err;
        const instructorId = results[0].id;
        const values = courseCodes.map(courseCode => [instructorId, courseCode]);
        const insertQuery = 'INSERT INTO instructors_courses (instructor_id, department_course_id) VALUES ?';
        conn.query(insertQuery, [values], (err, result) => {
            if (err) throw err;
            res.sendStatus(200);
        });
    });
});

// ---------------------------------------------------------------------- MakeExam
// // Endpoint to associate an exam with a course
// app.post('/api/associateExam', (req, res) => {
//     const { exam_id, course_code } = req.body;
//     const sql = 'UPDATE exams SET course_id = ? WHERE exam_id = ?';
//     conn.query(sql, [course_code, exam_id], (err, result) => {
//         if (err) throw err;
//         res.send({ message: 'MakeExam associated with course successfully' });
//     });
// });

// Endpoint to associate an exam with a course in instructors_courses table
app.post('/api/instructorsCoursesExams', (req, res) => {
    const { course_code, instructor_id, exam_id } = req.body;

    const sql = `
    INSERT INTO instructors_courses_exams (instructors_courses_id, exam_id) 
    VALUES (
    (
    SELECT IC.id FROM instructors_courses as IC
    INNER JOIN departments_courses as DC ON IC.department_course_id = DC.id 
    WHERE DC.course_id = ? and IC.instructor_id = ?
    ), ?)`;
    conn.query(sql, [course_code, instructor_id, exam_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ Error: "Error associating exam with instructor's course" });
        }
        return res.json({ Status: "Success" });
    });
});

// Endpoint to associate an exam with a course in enrolments_exams table
app.post('/api/enrollmentsExams', (req, res) => {
    const { course_code, instructor_id, exam_id } = req.body;
console.log(course_code, instructor_id, exam_id)
    const sql = `
    INSERT INTO enrollments_exams (enrollment_id, exam_id) 
    VALUES (
    (
    SELECT E.id FROM enrollments as E
    INNER JOIN instructors_courses as IC ON E.instructor_course_id = IC.id
    INNER JOIN departments_courses as DC ON IC.department_course_id = DC.id 
    WHERE DC.course_id = ? and IC.instructor_id = ?
    ), ?)
    `;
    conn.query(sql, [course_code, instructor_id, exam_id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.json({ Error: "Error associating exam with student's course" });
        }
        return res.json({ Status: "Success" });
    });
});

// Endpoint to create a new exam
app.post('/api/exams', (req, res) => {
    const { exam_name, duration, start_at } = req.body;
    console.log("start at:", start_at);
    const sql = "INSERT INTO exams (exam_name, duration, start_at) VALUES (?, ?, ?)";
    conn.query(sql, [exam_name, duration, start_at], (err, result) => {
        if (err) {
            return res.json({ Error: "Error inserting exam" });
        }
        return res.json({ exam_id: result.insertId });
    });
});


// Endpoint to add a question
app.post('/api/questions', (req, res) => {
    const { exam_id, question_text, points } = req.body;
    const sql = 'INSERT INTO questions (exam_id, question_text, points) VALUES (?, ?, ?)';
    conn.query(sql, [exam_id, question_text, points], (err, result) => {
        if (err) {
            return res.json({ Error: "Error inserting exam" });
        }
        res.send({ question_id: result.insertId });
    });
});

// Endpoint to add an answer
app.post('/api/answers', (req, res) => {
    const { question_id, answer_text, is_correct } = req.body;
    const sql = 'INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)';
    conn.query(sql, [question_id, answer_text, is_correct], (err, result) => {
        if (err) {
            return res.json({ Error: "Error inserting exam" });
        }
        res.send({ answer_id: result.insertId });
    });
});

// GET exams for course
app.get('/api/exams/:courseId', (req, res) => {
    const { courseId } = req.params;
    const sql = `
    SELECT e.exam_id AS examId, e.exam_name AS examName
    FROM exams AS e
    INNER JOIN instructors_courses_exams AS ice ON e.exam_id = ice.exam_id
    INNER JOIN instructors_courses AS ic ON ice.instructors_courses_id = ic.id
    INNER JOIN departments_courses AS dc ON ic.department_course_id = dc.id
    WHERE dc.course_id = ?
  `;
    conn.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching exams:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// get exam details
app.get('/api/exams-details/:courseId', (req, res) => {
    const { courseId } = req.params;
    const sql = `
    SELECT exam_name, duration, start_at 
    FROM exams 
    WHERE exam_id = ?
  `;
    conn.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching exam details:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// get exam questions
app.get('/api/exams-questions/:examId', (req, res) => {
    const { examId } = req.params;
    const sql = `
    SELECT e.exam_id, q.question_id, q.question_text, q.points
    FROM exams as e 
    INNER JOIN questions as q ON e.exam_id = q.exam_id
    WHERE e.exam_id = ?
  `;
    conn.query(sql, [examId], (err, results) => {
        if (err) {
            console.error('Error fetching exam questions:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// get exam answers
app.get('/api/exams-answers/:examId', (req, res) => {
    const { examId } = req.params;
    const sql = `
    SELECT q.question_id, a.answer_id, a.answer_text, a.is_correct FROM exams as e
    INNER JOIN questions as q ON e.exam_id = q.exam_id
    INNER JOIN answers as a ON q.question_id = a.question_id
    WHERE e.exam_id = ?
  `;
    conn.query(sql, [examId], (err, results) => {
        if (err) {
            console.error('Error fetching exam answers:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// PUT student answers to student-answer table
app.post('/api/student-answers/:userId', (req, res) => {
    const { userId } = req.params;
    const { answers, examId } = req.body;

    const checkSubmissionSql = `
      SELECT is_submitted FROM enrollments_exams 
      WHERE exam_id = ? AND enrollment_id = (
        SELECT E.id FROM enrollments as E
        INNER JOIN users as U ON E.student_id = U.id
        WHERE U.id = ?
      )
    `;

    conn.query(checkSubmissionSql, [examId, userId], (err, results) => {
        if (err) {
            console.error('Error checking submission:', err);
            res.status(500).send('Server error');
        } else if (results.length > 0 && results[0].is_submitted) {
            res.status(403).send('Exam already submitted');
        } else {
            // Insert each answer
            const insertAnswerPromises = answers.map(answer => {
                const { questionId, answerText, isCorrect } = answer;
                const insertAnswerSql = `
                  INSERT INTO student_answers (question_id, answer_text, is_correct, enrollment_exam_id)
                  VALUES (?, ?, ?, (
                    SELECT ee.id FROM enrollments_exams as ee 
                    INNER JOIN enrollments as e ON ee.enrollment_id = e.id
                    WHERE ee.exam_id = ? and e.student_id = ?
                  )) 
                `;
                return new Promise((resolve, reject) => {
                    conn.query(insertAnswerSql, [questionId, answerText, isCorrect, examId, userId], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(result);
                    });
                });
            });

            Promise.all(insertAnswerPromises)
                .then(() => {
                    // Mark the exam as submitted
                    const markSubmittedSql = `
                      UPDATE enrollments_exams
                      SET is_submitted = 1
                      WHERE exam_id = ? AND enrollment_id = (
                        SELECT E.id FROM enrollments as E
                        INNER JOIN users as U ON E.student_id = U.id
                        WHERE U.id = ?
                      )
                    `;
                    conn.query(markSubmittedSql, [examId, userId], (err, results) => {
                        if (err) {
                            console.error('Error marking exam as submitted:', err);
                            res.status(500).send('Server error');
                        } else {
                            res.json({ message: 'Score updated and exam submitted successfully' });
                        }
                    });
                })
                .catch(err => {
                    console.error('Error inserting answers:', err);
                    res.status(500).send('Server error');
                });
        }
    });
});

// check student if take the exam or not
app.get('/api/student-exam-status/:userId/:examId', (req, res) => {
    const { userId, examId } = req.params;

    const sql = `
      SELECT is_submitted FROM enrollments_exams 
      WHERE exam_id = ? AND enrollment_id = (
        SELECT E.id FROM enrollments as E
        INNER JOIN users as U ON E.student_id = U.id
        WHERE U.id = ?
      )
    `;

    conn.query(sql, [examId, userId], (err, results) => {
        if (err) {
            console.error('Error checking submission:', err);
            res.status(500).send('Server error');
        } else if (results.length > 0) {
            res.json({ is_submitted: results[0].is_submitted });
        } else {
            res.json({ is_submitted: false });
        }
    });
});


// GET results of exam
// app.get('/api/exam-results/:examId', (req, res) => {
//     const { examId } = req.params;
//     const sql = `
//     SELECT u.id AS studentId,
//     CONCAT(u.first_name, ' ', u.last_name) AS studentName, ee.score
//     FROM enrollments_exams AS ee
//     INNER JOIN enrollments AS e ON ee.enrollment_id = e.id
//     INNER JOIN users AS u ON e.student_id = u.id
//     WHERE ee.exam_id = ?
//   `;
//     conn.query(sql, [examId], (err, results) => {
//         if (err) {
//             console.error('Error fetching exam results:', err);
//             res.status(500).send('Server error');
//         } else {
//             res.json(results);
//         }
//     });
// });

// PUT the score of the exam to the student in enrollments_exams
app.put('/api/exam-results/:enrollmentId/:examId', (req, res) => {
    const { enrollmentId, examId } = req.params;
    const { score } = req.body;
    const sql = `
    UPDATE enrollments_exams 
    SET score = ? 
    WHERE enrollment_id = ? AND exam_id = ?
  `;
    conn.query(sql, [score, enrollmentId, examId], (err, results) => {
        if (err) {
            console.error('Error updating exam score:', err);
            res.status(500).send('Server error');
        } else {
            res.json({ message: 'Score updated successfully' });
        }
    });
});

// get exam, questions and answers to Preview by instructor
app.get('/api/exam-preview/:examId', (req, res) => {
    const { examId } = req.params;
    const sql = `
    SELECT e.exam_name, e.duration, e.start_at, q.question_text, q.points, a.answer_text, a.is_correct
    FROM exams as e 
    INNER JOIN questions as q ON e.exam_id = q.exam_id
    INNER JOIN answers as a ON q.question_id = a.question_id
    WHERE e.exam_id = ?
    `;
    conn.query(sql, [examId], (err, results) => {
        if (err) {
            console.error('Error fetching exam to Preview:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// Edit Exam Endpoint
app.put('/api/exams/:examId', (req, res) => {
    const { examId } = req.params;
    const { exam_name, duration, start_at, questions } = req.body;

    const updateExamDetails = () => {
        return new Promise((resolve, reject) => {
            conn.query(
                `UPDATE exams SET exam_name = ?, duration = ?, start_at = ? WHERE exam_id = ?`,
                [exam_name, duration, start_at, examId],
                (err, result) => {
                    if (err) {
                        console.error('Error updating exam:', err);
                        return reject('Error updating exam');
                    }
                    resolve();
                }
            );
        });
    };

    const updateQuestion = (question) => {
        return new Promise((resolve, reject) => {
            conn.query(
                `UPDATE questions SET question_text = ?, points = ? WHERE question_id = ?`,
                [question.question_text, question.question_points, question.question_id],
                (err, result) => {
                    if (err) {
                        console.error('Error updating question:', err);
                        return reject('Error updating question');
                    }
                    resolve();
                }
            );
        });
    };

    const updateOption = (option) => {
        return new Promise((resolve, reject) => {
            conn.query(
                `UPDATE answers SET answer_text = ?, is_correct = ? WHERE answer_id = ?`,
                [option.answer_text, option.is_correct, option.answer_id],
                (err, result) => {
                    if (err) {
                        console.error('Error updating option:', err);
                        return reject('Error updating option');
                    }
                    resolve();
                }
            );
        });
    };

    const processQuestions = async (questions) => {
        for (const question of questions) {
            await updateQuestion(question);
            if (question.options && question.options.length > 0) {
                for (const option of question.options) {
                    await updateOption(option);
                }
            }
        }
    };

    conn.beginTransaction(async (err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).send({ message: 'Error starting transaction' });
        }

        try {
            await updateExamDetails();
            if (questions && questions.length > 0) {
                await processQuestions(questions);
            }

            conn.commit((err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    return conn.rollback(() => {
                        res.status(500).send({ message: 'Error committing transaction' });
                    });
                }
                res.status(200).send({ message: 'Exam updated successfully' });
            });
        } catch (error) {
            console.error('Error during transaction:', error);
            conn.rollback(() => {
                res.status(500).send({ message: error });
            });
        }
    });
});



// Delete Exam Endpoint
app.delete('/api/exams/:examId', async (req, res) => {
    const { examId } = req.params;
    const query = 'DELETE FROM exams WHERE exam_id = ?';
    conn.query(query, [examId], (err, results) => {
        if (err) throw err;
        res.json({ message: 'exam deleted successfully' });
    });
});



// Endpoint to get notifications
app.get('/api/notifications/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT n.id, n.message, n.is_read, n.created_at 
    FROM notifications as n 
    INNER JOIN enrollments as e ON n.instructor_course_id = e.instructor_course_id
    WHERE e.student_id = ?
    `;
    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// Endpoint to get unread notifications
app.get('/api/unread-notifications/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
    SELECT n.message, n.created_at FROM notifications as n 
    INNER JOIN enrollments as e ON n.instructor_course_id = e.instructor_course_id
    WHERE e.student_id = ? AND is_read = 0
    `;
    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// Endpoint to mark notifications as read
app.post('/api/mark-notifications-read/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
    UPDATE notifications 
    SET is_read = 1 
    WHERE id IN (
        SELECT n.id 
        FROM notifications as n 
        INNER JOIN enrollments as e ON n.instructor_course_id = e.instructor_course_id
        WHERE e.student_id = ? AND n.is_read = 0
    )`;

    conn.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error marking notifications as read:', err);
            res.status(500).send('Server error');
        } else {
            res.json({ message: 'Notifications marked as read' });
        }
    });
});


app.post('/send-notification', (req, res) => {
    const { userId, message } = req.body;
    const sql = 'INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, 0)';
    conn.query(sql, [userId, message], (err, result) => {
        if (err) {
            console.error('Error sending notification:', err);
            res.status(500).send('Server error');
        } else {
            io.emit('notification', { userId, message });
            res.status(200).send('Notification sent');
        }
    });
});

// get meeting id from instructors_courses table
app.get('/api/instructor-meeting/:instructorId/:courseId', (req, res) => {
    const { instructorId, courseId } = req.params;
    const sql = `
    SELECT ic.meeting_id FROM instructors_courses as ic
    INNER JOIN departments_courses as dc ON ic.department_course_id = dc.id
    WHERE ic.instructor_id = ? AND dc.course_id = ?
  `;
    conn.query(sql, [instructorId, courseId], (err, results) => {
        if (err) {
            console.error('Error get meeting id:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results[0]);
        }
    });
});

app.get('/api/student-meeting/:studentId/:courseId', (req, res) => {
    const { studentId, courseId } = req.params;
    const sql = `
    SELECT ic.meeting_id FROM enrollments as e 
    INNER JOIN instructors_courses as ic ON e.instructor_course_id = ic.id
    INNER JOIN departments_courses as dc ON ic.department_course_id = dc.id
    WHERE e.student_id = ? AND dc.course_id = ?
  `;
    conn.query(sql, [studentId, courseId], (err, results) => {
        if (err) {
            console.error('Error get meeting id:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results[0]);
        }
    });
});

// // Global error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Internal Server Error' });
// });

server.listen(4001, () => {
    console.log('Server is running on port 4001');
});

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
