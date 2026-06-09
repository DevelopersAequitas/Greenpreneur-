import db from './config/db.js';

async function runMigration() {
  try {
    const conn = await db.getConnection();
    
    // Add new columns to nomination_votes
    const columnsToAdd = [
      'voter_name VARCHAR(255)',
      'voter_business VARCHAR(255)',
      'voter_designation VARCHAR(255)',
      'voter_phone VARCHAR(50)',
      'voter_city VARCHAR(255)',
      'voter_remarks TEXT'
    ];

    for (const col of columnsToAdd) {
      try {
        await conn.query(`ALTER TABLE nomination_votes ADD COLUMN ${col}`);
        console.log(`✅ Added column ${col}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️ Column ${col.split(' ')[0]} already exists.`);
        } else {
          throw err;
        }
      }
    }
    
    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
