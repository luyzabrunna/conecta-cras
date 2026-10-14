const mysql = require('mysql2/promise');
require('dotenv').config({ quiet: true });

// Create a MySQL connection pool
// Use environment variables for database configuration, with default values if not provided
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'conecta_cras',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  charset: 'utf8mb4',
});

module.exports = pool;
