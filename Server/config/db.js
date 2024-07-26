const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "college_platform",
    timezone: 'UTC',
    flags: ['--max_allowed_packet=64M']
});
conn.connect(function (err){
    if(err) throw err;
    console.log("Connected To Database :)");
});

module.exports = conn;