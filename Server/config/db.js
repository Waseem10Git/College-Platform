const mysql = require('mysql2');
const env = require('dotenv');

env.config();

const connectionOptions = mysql.createConnection(process.env.MYSQL_URL);

const conn = mysql.createConnection({
    ...connectionOptions.config,
    timezone: 'UTC',
    flags: ['--max_allowed_packet=64M']
});
conn.connect(function (err){
    if(err) throw err;
    console.log("Connected To Database :)");
});

module.exports = conn;