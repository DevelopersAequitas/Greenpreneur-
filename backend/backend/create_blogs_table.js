// =============================================================================
// Migration: Create Blogs Table
// File: backend/create_blogs_table.js
// =============================================================================

import pool from './config/db.js';

async function run() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        featured_image VARCHAR(255) DEFAULT NULL,
        author VARCHAR(255) DEFAULT 'Greenpreneur Team',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(sql);
    console.log('✅  Blogs table created or already exists!');
  } catch (err) {
    console.error('❌  Error creating blogs table:', err);
  } finally {
    process.exit(0);
  }
}

run();
