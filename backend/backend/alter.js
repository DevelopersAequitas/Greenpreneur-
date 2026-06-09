import pool from './config/db.js';

async function alter() {
  try {
    await pool.query('ALTER TABLE nominations ADD COLUMN voting_url VARCHAR(255) NULL AFTER status');
    console.log('Column added successfully');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists');
    } else {
      console.error(err);
    }
  } finally {
    process.exit(0);
  }
}
alter();
