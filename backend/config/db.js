const mysql = require('mysql2/promise');
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD);
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'bc_game_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;