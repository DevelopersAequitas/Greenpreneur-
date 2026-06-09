const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'Greenpreneur',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL database.');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        inquiry_type VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        organization VARCHAR(255),
        designation VARCHAR(255),
        website_link VARCHAR(255),
        budget_range VARCHAR(100),
        interests JSON,
        message TEXT,
        attachment_url_1 VARCHAR(500),
        attachment_url_2 VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    console.log('Creating inquiries table...');
    await connection.query(createTableQuery);
    console.log('inquiries table created successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

migrate();
