import pool from './config/db.js';
import fs from 'fs';
import path from 'path';

async function generateSQL() {
  try {
    console.log('Generating SQL import script...');

    // 1. Fetch newly inserted speakers (IDs > 4 are the new ones, since original had IDs 1-4)
    const [speakers] = await pool.query('SELECT * FROM jury WHERE id > 4');
    
    // 2. Fetch newly inserted partners (IDs > 4 are the new ones)
    const [partners] = await pool.query('SELECT * FROM partners WHERE id > 4');

    let sqlContent = `-- =============================================================================
-- Greenpreneur Database Import Script — Speakers & Partners
-- Run this script in phpMyAdmin or MySQL console on your live Hostinger server.
-- =============================================================================

USE \`greenpreneur\`; -- Adjust database name if different on live server

-- 1. Insert Speakers & Jury
`;

    for (const s of speakers) {
      // Escape strings for SQL safety
      const name = s.name.replace(/'/g, "\\'");
      const role = s.role.replace(/'/g, "\\'");
      const org = s.org.replace(/'/g, "\\'");
      
      let tagsVal = s.tags;
      if (typeof tagsVal === 'string') {
        try {
          tagsVal = JSON.parse(tagsVal);
        } catch (e) {}
      }
      const tags = JSON.stringify(tagsVal).replace(/'/g, "\\'");
      const photo_url = s.photo_url.replace(/'/g, "\\'");
      const bg_gradient = s.bg_gradient.replace(/'/g, "\\'");

      sqlContent += `INSERT INTO \`jury\` (\`name\`, \`role\`, \`org\`, \`tags\`, \`photo_url\`, \`bg_gradient\`, \`is_published\`) VALUES ('${name}', '${role}', '${org}', '${tags}', '${photo_url}', '${bg_gradient}', 1);\n`;
    }

    sqlContent += `\n-- 2. Insert Partners\n`;

    for (const p of partners) {
      const name = p.name.replace(/'/g, "\\'");
      const role = p.role.replace(/'/g, "\\'");
      const org = p.org.replace(/'/g, "\\'");
      
      let tagsVal = p.tags;
      if (typeof tagsVal === 'string') {
        try {
          tagsVal = JSON.parse(tagsVal);
        } catch (e) {}
      }
      const tags = JSON.stringify(tagsVal).replace(/'/g, "\\'");
      const photo_url = p.photo_url.replace(/'/g, "\\'");
      const bg_gradient = p.bg_gradient.replace(/'/g, "\\'");

      sqlContent += `INSERT INTO \`partners\` (\`name\`, \`role\`, \`org\`, \`tags\`, \`photo_url\`, \`bg_gradient\`, \`is_published\`) VALUES ('${name}', '${role}', '${org}', '${tags}', '${photo_url}', '${bg_gradient}', 1);\n`;
    }

    const outputPath = path.join(process.cwd(), '..', 'speakers_partners_import.sql');
    fs.writeFileSync(outputPath, sqlContent, 'utf8');
    console.log(`🎉 Successfully generated SQL script at: ${outputPath}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ SQL generation failed:', error);
    process.exit(1);
  }
}

generateSQL();
