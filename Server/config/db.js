const mysql = require('mysql2');
const env = require('dotenv');

env.config();

// Use the environment variable for the database connection URL
// console.log('MYSQL URL: ', process.env.MYSQL_URL);
const URL = "mysql://root:LTHXdLlXXNCJwMWalCawCXrLnMBnqlXn@mysql.railway.internal:3306/railway"
const conn = mysql.createConnection(URL);


// Database connection with error handling
conn.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log("Connected to the MySQL database.");
});

module.exports = conn;
