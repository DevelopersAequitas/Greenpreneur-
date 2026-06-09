import db from './config/db.js';

async function run() {
  try {
    const [catRows] = await db.query('SELECT * FROM award_categories ORDER BY id DESC LIMIT 5');
    console.log('--- Award Categories Table ---');
    console.log(catRows);
  } catch(e) { console.error(e.message); }
  process.exit();
}

run();
