const mysql = require('mysql2');
const env = require('dotenv');

env.config();

const conn = mysql.createConnection(process.env.MYSQL_URL);
conn.connect(function (err){
    if(err) throw err;
    console.log("Connected To Database :)");
});

module.exports = conn;