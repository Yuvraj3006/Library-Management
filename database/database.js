const mysql = require('mysql2')
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    database:process.env.DATABASE_NAME,
    port:process.env.DATABASE_PORT,
    password:process.env.DATABASE_PASSWORD,
    user:process.env.DATABASE_USER,
});
//console.log(process.env.DATABASE_HOST);
module.exports = db;