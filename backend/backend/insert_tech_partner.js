import pool from './config/db.js';

async function run() {
  try {
    // Delete if already exists to avoid duplicates
    await pool.query("DELETE FROM sponsors WHERE name = 'Aequitas Infotech'");
    
    // Insert new Technology Partner Aequitas Infotech
    const query = `
      INSERT INTO sponsors (name, role, org, tags, photo_url, bg_gradient, is_published) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      'Aequitas Infotech', 
      'Technology Partner', 
      'Aequitas Infotech', 
      '["Technology Partner"]', 
      '/uploads/nominations/AequitasInfotech.png', 
      'linear-gradient(160deg,#1e3c72,#2a5298)', 
      1
    ];
    await pool.query(query, values);
    console.log("✅ Successfully inserted Aequitas Infotech into local MySQL database!");
    process.exit(0);
  } catch (err) {
    console.error("Error inserting Aequitas Infotech:", err);
    process.exit(1);
  }
}

run();
