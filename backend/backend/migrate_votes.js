import db from './config/db.js';

async function runMigration() {
  try {
    const conn = await db.getConnection();
    
    // Create nomination_votes table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS nomination_votes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nomination_id INT NOT NULL,
        voter_email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_vote (nomination_id, voter_email)
      )
    `);
    console.log('✅ Created nomination_votes table.');
    
    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
