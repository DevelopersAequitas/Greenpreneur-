// =============================================================================
// Router: Blogs API
// File: backend/routes/blogs.js
// =============================================================================

import express from 'express';
import pool from '../config/db.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer Setup for Featured Images
const uploadDir = path.join(process.cwd(), 'uploads', 'blogs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper to generate unique slugs
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// ── Public Routes ────────────────────────────────────────────────────────────

// 1. Get all blog posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
  }
});

// 2. Get blog post by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
  }
});

// 3. Get blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blog post' });
  }
});

// ── Protected Admin Routes ───────────────────────────────────────────────────

// 4. Create new blog post
router.post('/', verifyAdmin, upload.single('featured_image'), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    let slug = slugify(title);
    // Ensure unique slug
    const [existing] = await pool.query('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const imagePath = req.file ? `/uploads/blogs/${req.file.filename}` : null;
    const blogAuthor = author || 'Greenpreneur Team';

    const [result] = await pool.query(
      'INSERT INTO blogs (title, slug, content, featured_image, author) VALUES (?, ?, ?, ?, ?)',
      [title, slug, content, imagePath, blogAuthor]
    );

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: { id: result.insertId, title, slug, content, featured_image: imagePath, author: blogAuthor }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ success: false, message: 'Failed to create blog post' });
  }
});

// 5. Update existing blog post
router.put('/:id', verifyAdmin, upload.single('featured_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    // Check if blog exists
    const [existing] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const currentBlog = existing[0];
    let imagePath = currentBlog.featured_image;

    // If new image is uploaded, remove the old one if it exists
    if (req.file) {
      imagePath = `/uploads/blogs/${req.file.filename}`;
      if (currentBlog.featured_image) {
        const oldImagePath = path.join(process.cwd(), currentBlog.featured_image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image file:', err);
        });
      }
    }

    // Generate slug from the new title if it changed
    let slug = currentBlog.slug;
    if (title !== currentBlog.title) {
      slug = slugify(title);
      const [existingSlug] = await pool.query('SELECT id FROM blogs WHERE slug = ? AND id != ?', [slug, id]);
      if (existingSlug.length > 0) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    const blogAuthor = author || currentBlog.author;

    await pool.query(
      'UPDATE blogs SET title = ?, slug = ?, content = ?, featured_image = ?, author = ? WHERE id = ?',
      [title, slug, content, imagePath, blogAuthor, id]
    );

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: { id, title, slug, content, featured_image: imagePath, author: blogAuthor }
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ success: false, message: 'Failed to update blog post' });
  }
});

// 6. Delete blog post
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists to delete image
    const [existing] = await pool.query('SELECT featured_image FROM blogs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const currentBlog = existing[0];
    if (currentBlog.featured_image) {
      const imagePath = path.join(process.cwd(), currentBlog.featured_image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }

    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ success: false, message: 'Failed to delete blog post' });
  }
});

// 7. Upload inline image inside rich text editor
router.post('/upload-inline', verifyAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const imageUrl = `/uploads/blogs/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error('Error uploading inline image:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

export default router;
// Trigger restart after port free
