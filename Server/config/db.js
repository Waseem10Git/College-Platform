const mysql = require('mysql2');
const env = require('dotenv');

env.config();
// console.log("MYSQL URL is:");
// console.log(process.env.MYSQL_URL);
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'college_platform'
});


// Database connection with error handling
conn.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log("Connected to the MySQL database.");
});

module.exports = conn;
