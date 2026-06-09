import db from './config/db.js';

async function run() {
  try {
    await db.query(`ALTER TABLE nominations ADD COLUMN profile_picture VARCHAR(500) DEFAULT NULL AFTER website_link`);
    console.log("Added profile_picture");
  } catch(e) { console.error(e.message); }
  
  try {
    await db.query(`ALTER TABLE nominations ADD COLUMN business_logo VARCHAR(500) DEFAULT NULL AFTER profile_picture`);
    console.log("Added business_logo");
  } catch(e) { console.error(e.message); }
  
  process.exit();
}

run();
