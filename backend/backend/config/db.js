// =============================================================================
// Database Connection — MySQL2 Pool
// File: backend/config/db.js
// =============================================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || '127.0.0.1',
  port:               parseInt(process.env.DB_PORT || '3306'),
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'Greenpreneur',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+05:30',   // IST
  charset:            'utf8mb4',
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅  MySQL connected to database:', process.env.DB_NAME || 'Greenpreneur');
    conn.release();
  })
  .catch(err => {
    console.error('❌  MySQL connection failed:', err.message);
    process.exit(1);
  });

export default pool;
