import db from './config/db.js';

async function run() {
  try {
    const [rows] = await db.query('SELECT id, nominee_name, profile_picture FROM nominations ORDER BY id DESC LIMIT 5');
    console.log(rows);
  } catch(e) { console.error(e.message); }
  process.exit();
}

run();
