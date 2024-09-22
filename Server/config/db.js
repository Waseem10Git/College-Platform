const mysql = require('mysql2');
const env = require('dotenv');

env.config();

const conn = mysql.createConnection('mysql://root:HxsnpogUcXIOlgTVXQgRIiUXlLCLLYxU@mysql-ow2_.railway.internal:3306/railway');
conn.connect(function (err){
    if(err) throw err;
    console.log("Connected To Database :)");
});

module.exports = conn;