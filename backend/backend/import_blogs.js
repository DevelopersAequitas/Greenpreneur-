import fs from 'fs';
import path from 'path';
import https from 'https';
import pool from './config/db.js';

const postsJsonPath = 'C:\\\\Users\\\\hardi\\\\.gemini\\\\antigravity\\\\brain\\\\bdb31507-7017-4c47-b4ba-c4b9d7c8d8e0\\\\scratch\\\\wp_posts.json';
const sqlOutPath = path.join(import.meta.dirname, '..', '..', 'blogs_import.sql');

// Helper function to download file
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Escape SQL helper
function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

async function run() {
  try {
    console.log('Loading raw WordPress posts...');
    const rawData = fs.readFileSync(postsJsonPath, 'utf8');
    const posts = JSON.parse(rawData);
    console.log(`Found ${posts.length} posts to process.`);

    // Create uploads/blogs directories relative to the script location (backend/backend/uploads/blogs)
    const uploadsDir = path.join(import.meta.dirname, 'uploads', 'blogs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Prepare SQL file header
    let sqlContent = `-- =============================================================================\n`;
    sqlContent += `-- Greenpreneur — Blogs Import SQL\n`;
    sqlContent += `-- Generated: ${new Date().toISOString()}\n`;
    sqlContent += `-- =============================================================================\n\n`;
    sqlContent += `USE gree_greenpreneur_db;\n\n`;
    sqlContent += `DELETE FROM blogs;\n\n`;

    let successCount = 0;

    for (const post of posts) {
      const title = post.title?.rendered || '';
      const slug = post.slug || '';
      const content = post.content?.rendered || '';
      const author = post._embedded?.author?.[0]?.name || 'Greenpreneur Team';
      const createdAt = post.date ? post.date.replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Find featured image URL
      const mediaUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      let featuredImagePath = null;

      if (mediaUrl) {
        try {
          const extension = path.extname(new URL(mediaUrl).pathname) || '.jpg';
          const filename = `${slug}${extension}`;
          const localDest = path.join(uploadsDir, filename);

          console.log(`Downloading featured image for: ${title}`);
          await downloadFile(mediaUrl, localDest);
          featuredImagePath = `/uploads/blogs/${filename}`;
        } catch (err) {
          console.error(`  Warning: Failed to download image for ${title}:`, err.message);
        }
      }

      try {
        // 1. Insert into local database
        await pool.query(
          `INSERT INTO blogs (title, slug, content, featured_image, author, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), featured_image=VALUES(featured_image), author=VALUES(author)`,
          [title, slug, content, featuredImagePath, author, createdAt, createdAt]
        );

        // 2. Append to SQL file
        sqlContent += `INSERT INTO blogs (title, slug, content, featured_image, author, created_at, updated_at)\n`;
        sqlContent += `VALUES (\n`;
        sqlContent += `  ${escapeSql(title)},\n`;
        sqlContent += `  ${escapeSql(slug)},\n`;
        sqlContent += `  ${escapeSql(content)},\n`;
        sqlContent += `  ${escapeSql(featuredImagePath)},\n`;
        sqlContent += `  ${escapeSql(author)},\n`;
        sqlContent += `  ${escapeSql(createdAt)},\n`;
        sqlContent += `  ${escapeSql(createdAt)}\n`;
        sqlContent += `)\n`;
        sqlContent += `ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), featured_image=VALUES(featured_image), author=VALUES(author);\n\n`;

        successCount++;
        console.log(`✅  Successfully processed: ${title}`);
      } catch (err) {
        console.error(`❌  Failed to save blog ${title} to local database:`, err.message);
      }
    }

    // Write SQL file
    fs.writeFileSync(sqlOutPath, sqlContent, 'utf8');
    console.log(`\n🎉  Completed! Processed ${successCount}/${posts.length} blogs.`);
    console.log(`SQL import file written to: ${sqlOutPath}`);
  } catch (err) {
    console.error('Fatal error during import:', err);
  } finally {
    process.exit(0);
  }
}

run();
