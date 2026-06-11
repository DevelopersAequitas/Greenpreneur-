import pool from './config/db.js';

async function createTables() {
  try {
    const sponsorsQuery = `
      CREATE TABLE IF NOT EXISTS sponsors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'Sponsor',
        org VARCHAR(255) NOT NULL,
        tags JSON,
        photo_url VARCHAR(255),
        bg_gradient VARCHAR(100),
        is_published TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    const partnersQuery = `
      CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        org VARCHAR(255) NOT NULL,
        tags JSON,
        photo_url VARCHAR(255),
        bg_gradient VARCHAR(100),
        is_published TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    const juryQuery = `
      CREATE TABLE IF NOT EXISTS jury (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        org VARCHAR(255) NOT NULL,
        tags JSON,
        photo_url VARCHAR(255),
        bg_gradient VARCHAR(100),
        is_published TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    await pool.query(sponsorsQuery);
    console.log('✅ sponsors table created/verified');
    await pool.query(partnersQuery);  
    console.log('✅ partners table created/verified');
    await pool.query(juryQuery);
    console.log('✅ jury table created/verified');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
