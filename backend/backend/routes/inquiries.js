import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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

// Handle form submission with up to 2 files
router.post('/', upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), async (req, res) => {
  try {
    const { 
      inquiry_type, 
      name, 
      email, 
      phone, 
      organization, 
      designation, 
      website_link, 
      budget_range, 
      interests, 
      message 
    } = req.body;

    if (!inquiry_type || !name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Type, Name, Email, and Phone are required.' });
    }

    // Process uploaded files
    let attachment_url_1 = null;
    let attachment_url_2 = null;

    if (req.files) {
      if (req.files.file1 && req.files.file1.length > 0) {
        attachment_url_1 = '/uploads/' + req.files.file1[0].filename;
      }
      if (req.files.file2 && req.files.file2.length > 0) {
        attachment_url_2 = '/uploads/' + req.files.file2[0].filename;
      }
    }

    const query = `
      INSERT INTO inquiries (
        inquiry_type, name, email, phone, organization, designation, 
        website_link, budget_range, interests, message, 
        attachment_url_1, attachment_url_2
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Parse interests if passed as stringified JSON
    let parsedInterests = interests;
    if (typeof interests === 'string') {
        try { parsedInterests = JSON.parse(interests); } 
        catch (e) { parsedInterests = interests; }
    }

    const values = [
      inquiry_type, name, email, phone, organization || null, designation || null,
      website_link || null, budget_range || null, JSON.stringify(parsedInterests) || null, message || null,
      attachment_url_1, attachment_url_2
    ];

    const [result] = await pool.execute(query, values);

    // Trigger Zoho email confirmation asynchronously
    try {
      await fetch('http://localhost:3000/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          type: inquiry_type,
          details: {
            Organization: organization || 'N/A',
            Phone: phone,
            Message: message || 'N/A'
          }
        })
      });
    } catch (emailErr) {
      console.error('Failed to send inquiry confirmation email:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: { id: result.insertId }
    });

  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Route to get all inquiries (for future admin dashboard)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

export default router;
