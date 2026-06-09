import pool from './config/db.js';

async function alter() {
  try {
    const columns = [
      "ALTER TABLE community_applications ADD COLUMN website VARCHAR(255) DEFAULT NULL AFTER company",
      "ALTER TABLE community_applications ADD COLUMN promoter_image VARCHAR(255) DEFAULT NULL AFTER why_join",
      "ALTER TABLE community_applications ADD COLUMN organization_logo VARCHAR(255) DEFAULT NULL AFTER promoter_image",
      "ALTER TABLE community_applications ADD COLUMN payment_status ENUM('pending', 'paid', 'failed', 'not_applicable') NOT NULL DEFAULT 'pending' AFTER organization_logo",
      "ALTER TABLE community_applications ADD COLUMN payment_ref VARCHAR(100) DEFAULT NULL AFTER payment_status"
    ];

    for (const sql of columns) {
      try {
        await pool.query(sql);
        console.log(`Successfully run: ${sql}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists: ${sql.split('ADD COLUMN ')[1].split(' ')[0]}`);
        } else {
          console.error(`Error running: ${sql}`, err);
        }
      }
    }
  } catch (err) {
    console.error('Alter error:', err);
  } finally {
    process.exit(0);
  }
}
alter();
