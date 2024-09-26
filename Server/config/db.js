const mysql = require('mysql2');
const env = require('dotenv');

env.config();
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
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
