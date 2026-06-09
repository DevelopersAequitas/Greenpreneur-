import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads', 'nominations');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only_123';

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Greenpreneur',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Admin Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    // Update last login
    await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Verify token route (used by frontend to check if logged in)
router.get('/verify', verifyAdmin, (req, res) => {
  res.json({ success: true, user: req.admin });
});

// Protected: Get all nominations
router.get('/nominations', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_nominations_summary ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching nominations' });
  }
});

// Protected: Get all inquiries (with optional type filter)
router.get('/inquiries', verifyAdmin, async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM inquiries';
    let params = [];

    if (type) {
      query += ' WHERE inquiry_type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching inquiries' });
  }
});

// Protected: Get all sponsorships
router.get('/sponsorships', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sponsorships ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching sponsorships' });
  }
});

// Protected: Get all event registrations
router.get('/event-registrations', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM event_registrations ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching event registrations' });
  }
});

// Protected: Add a new winner directly
router.post('/winners', verifyAdmin, upload.single('profilePicture'), async (req, res) => {
  try {
    const { nominee_name, business_name, category, website_link, city, description } = req.body;

    if (!nominee_name || !category) {
      return res.status(400).json({ success: false, message: 'Nominee Name and Category are required' });
    }

    // Lookup or Create Category
    let categoryId = null;
    const [catRows] = await pool.query('SELECT id FROM award_categories WHERE name = ?', [category]);
    if (catRows.length > 0) {
      categoryId = catRows[0].id;
    } else {
      const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const [insertCat] = await pool.query('INSERT INTO award_categories (name, slug, is_active) VALUES (?, ?, 1)', [category, slug]);
      categoryId = insertCat.insertId;
    }

    const profilePic = req.file ? `/uploads/nominations/${req.file.filename}` : null;

    // Insert Winner
    await pool.query(
      `INSERT INTO nominations (
        track, nominee_name, business_name, phone, email, city, category_id, description, status, payment_status, award_year, profile_picture, website_link
      ) VALUES (
        'honorary', ?, ?, '', '', ?, ?, ?, 'winner', 'completed', '2025', ?, ?
      )`,
      [nominee_name.trim(), business_name?.trim() || '', city?.trim() || '', categoryId, description?.trim() || '', profilePic, website_link?.trim() || null]
    );

    res.json({ success: true, message: 'Winner added successfully!' });
  } catch (error) {
    console.error('Error adding winner:', error);
    res.status(500).json({ success: false, message: 'Error adding winner' });
  }
});

export default router;
