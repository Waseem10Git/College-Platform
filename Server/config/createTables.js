const db = require('./db')

const createTables = async () => {
    const dbPromise = db.promise();

    try {
        // 1. Creating `departments` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS departments (
        department_id INT PRIMARY KEY AUTO_INCREMENT,
        department_name ENUM('IS', 'CS', 'AI', 'BI', 'Not In Department') NOT NULL
      );
    `);

        // 2. Creating `users` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT(8) PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(25) NOT NULL,
        middle_name VARCHAR(25) NOT NULL,
        last_name VARCHAR(25) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password TEXT NOT NULL,
        image LONGBLOB,
        role ENUM('student', 'instructor', 'admin') NOT NULL,
        department_id INT NOT NULL,
        CHECK (email LIKE '%@fcai.usc.edu.eg'),
        FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 3. Creating `courses` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS courses (
        course_code VARCHAR(25) PRIMARY KEY,
        course_name VARCHAR(25) NOT NULL,
        description TEXT NOT NULL,
        image LONGBLOB,
        meeting_id VARCHAR(255)
      );
    `);

        // 4. Creating `chapters` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id INT(3) PRIMARY KEY AUTO_INCREMENT,
        chapter_name VARCHAR(25) NOT NULL,
        chapter_content LONGBLOB NOT NULL,
        course_id VARCHAR(25) NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(course_code) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 5. Creating `exams` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS exams (
        exam_id INT PRIMARY KEY AUTO_INCREMENT,
        exam_name VARCHAR(255) NOT NULL,
        duration INT,
        start_at DATETIME NOT NULL
      );
    `);

        // 6. Creating `questions` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS questions (
        question_id INT PRIMARY KEY AUTO_INCREMENT,
        exam_id INT NOT NULL,
        question_text TEXT NOT NULL,
        points INT NOT NULL,
        FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 7. Creating `answers` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS answers (
        answer_id INT PRIMARY KEY AUTO_INCREMENT,
        question_id INT NOT NULL,
        answer_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 8. Creating `assignments` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        assignment_id INT PRIMARY KEY AUTO_INCREMENT,
        assignment_title VARCHAR(255) NOT NULL,
        description TEXT,
        assignment_file_name VARCHAR(255),
        assignment_file LONGBLOB,
        answer_file_name VARCHAR(255),
        answer_file LONGBLOB,
        due_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 9. Creating `departments_courses` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS departments_courses (
        id VARCHAR(50) PRIMARY KEY,
        department_id INT NOT NULL,
        course_id VARCHAR(25) NOT NULL,
        level INT,
        semester INT,
        FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(course_code) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        await dbPromise.query(`
      CREATE TRIGGER IF NOT EXISTS before_insert_departments_courses
      BEFORE INSERT ON departments_courses
      FOR EACH ROW
      BEGIN
        SET NEW.id = CONCAT(NEW.department_id, '_', NEW.course_id);
      END;
    `);

        // 10. Creating `instructors_courses` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS instructors_courses (
        id VARCHAR(50) PRIMARY KEY,
        instructor_id INT(8) NOT NULL,
        department_course_id VARCHAR(50) NOT NULL,
        FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (department_course_id) REFERENCES departments_courses(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        await dbPromise.query(`
      CREATE TRIGGER IF NOT EXISTS before_insert_instructors_courses
      BEFORE INSERT ON instructors_courses
      FOR EACH ROW
      BEGIN
        SET NEW.id = CONCAT(NEW.instructor_id, '_', NEW.department_course_id);
      END;
    `);

        // 11. Creating `enrollments` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id VARCHAR(50) PRIMARY KEY,
        student_id INT(8) NOT NULL,
        instructor_course_id VARCHAR(50) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (instructor_course_id) REFERENCES instructors_courses(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        await dbPromise.query(`
      CREATE TRIGGER IF NOT EXISTS before_insert_enrollments
      BEFORE INSERT ON enrollments
      FOR EACH ROW
      BEGIN
        SET NEW.id = CONCAT(NEW.student_id, '_', NEW.instructor_course_id);
      END;
    `);

        // 12. Creating `instructors_courses_assignments` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS instructors_courses_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        instructors_courses_id VARCHAR(50) NOT NULL,
        assignment_id INT,
        FOREIGN KEY (instructors_courses_id) REFERENCES instructors_courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 13. Creating `instructors_courses_exams` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS instructors_courses_exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        instructors_courses_id VARCHAR(50) NOT NULL,
        exam_id INT,
        FOREIGN KEY (instructors_courses_id) REFERENCES instructors_courses(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 14. Creating `enrollments_assignments` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS enrollments_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_file_name VARCHAR(255),
        student_file LONGBLOB,
        enrollment_id VARCHAR(50) NOT NULL,
        assignment_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        score INT,
        is_submitted BOOLEAN,
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 15. Creating `enrollments_exams` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS enrollments_exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        enrollment_id VARCHAR(50) NOT NULL,
        exam_id INT NOT NULL,
        score INT DEFAULT NULL,
        is_submitted BOOLEAN,
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 16. Creating `notifications` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT(8) NOT NULL,
        message VARCHAR(255) NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 17. Creating `student_answers` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS student_answers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        enrollment_exam_id INT NOT NULL,
        question_id INT NOT NULL,
        answer_text TEXT,
        is_correct BOOLEAN,
        FOREIGN KEY (enrollment_exam_id) REFERENCES enrollments_exams(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

        // 18. Creating `user_notifications` table
        await dbPromise.query(`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        notification_id INT,
        isRead BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (notification_id) REFERENCES notifications(id)
      );
    `);

    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

module.exports = createTables;