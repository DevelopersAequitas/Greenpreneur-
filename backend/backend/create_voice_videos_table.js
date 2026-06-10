// =============================================================================
// Migration: Create Voice Videos Table
// File: backend/create_voice_videos_table.js
// =============================================================================

import pool from './config/db.js';

async function run() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS voice_videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        youtube_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(sql);
    console.log('✅  voice_videos table created or already exists!');
  } catch (err) {
    console.error('❌  Error creating voice_videos table:', err);
  } finally {
    process.exit(0);
  }
}

run();
