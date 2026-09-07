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

import pool from '../config/db.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only_123';

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
      { expiresIn: '24h' }
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

// Protected: Get all community applications
router.get('/community-applications', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM community_applications ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching community applications:', error);
    res.status(500).json({ success: false, message: 'Error fetching community applications' });
  }
});

// Protected: Update community application status
router.patch('/community-applications/:id/status', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ success: false, message: 'ID and status are required' });
  }

  try {
    await pool.query('UPDATE community_applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated successfully!' });
  } catch (error) {
    console.error('Error updating community application status:', error);
    res.status(500).json({ success: false, message: 'Error updating community application status' });
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
      const [insertCat] = await pool.query('INSERT INTO award_categories (name, slug, group_name, is_active) VALUES (?, ?, "Green Business", 1)', [category, slug]);
      categoryId = insertCat.insertId;
    }

    const profilePic = req.file ? `/uploads/nominations/${req.file.filename}` : null;

    // Insert Winner
    await pool.query(
      `INSERT INTO nominations (
        track, nominee_name, business_name, phone, email, city, category_id, description, status, payment_status, award_year, profile_picture, website_link
      ) VALUES (
        'honorary', ?, ?, '', '', ?, ?, ?, 'winner', 'paid', '2027', ?, ?
      )`,
      [nominee_name.trim(), business_name?.trim() || '', city?.trim() || '', categoryId, description?.trim() || '', profilePic, website_link?.trim() || null]
    );

    res.json({ success: true, message: 'Winner added successfully!' });
  } catch (error) {
    console.error('Error adding winner:', error);
    res.status(500).json({ success: false, message: 'Error adding winner' });
  }
});

// Protected: Get all winners (from both legacy winners and nominations tables)
router.get('/winners', verifyAdmin, async (req, res) => {
  try {
    const query = `
      SELECT id, name, company, city, award_year, track, impact_text, quote, photo_url, website_link, 'legacy' AS source
      FROM winners
      
      UNION ALL
      
      SELECT n.id, n.nominee_name AS name, n.business_name AS company, n.city, n.award_year, n.track,
             n.description AS impact_text, '' AS quote, n.profile_picture AS photo_url, n.website_link, 'nomination' AS source
      FROM nominations n
      JOIN award_categories ac ON n.category_id = ac.id
      WHERE n.status = 'winner'
      
      ORDER BY award_year DESC, name ASC
    `;
    const [rows] = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching winners:', error);
    res.status(500).json({ success: false, message: 'Error fetching winners' });
  }
});

// Protected: Delete a winner
router.delete('/winners/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { source } = req.query; // 'legacy' or 'nomination'

  if (!id) {
    return res.status(400).json({ success: false, message: 'Winner ID is required' });
  }

  try {
    if (source === 'nomination') {
      // Revert nominee status back to 'approved' (instead of winner)
      await pool.query('UPDATE nominations SET status = "approved" WHERE id = ?', [id]);
    } else {
      // Delete legacy winner record
      await pool.query('DELETE FROM winners WHERE id = ?', [id]);
    }
    res.json({ success: true, message: 'Winner removed successfully' });
  } catch (error) {
    console.error('Error deleting winner:', error);
    res.status(500).json({ success: false, message: 'Error deleting winner' });
  }
});

// Protected: Get all gallery sponsors
router.get('/gallery-sponsors', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sponsors ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gallery sponsors' });
  }
});

// Protected: Add a new gallery sponsor
router.post('/gallery-sponsors', verifyAdmin, upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, role, org, tags } = req.body;
    if (!name || !org) return res.status(400).json({ success: false, message: 'Name and Org are required' });
    const profilePic = req.file ? `/uploads/nominations/${req.file.filename}` : null;
    await pool.query(
      'INSERT INTO sponsors (name, role, org, tags, photo_url) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), role?.trim() || 'Sponsor', org.trim(), tags || null, profilePic]
    );
    res.json({ success: true, message: 'Sponsor added successfully!' });
  } catch (error) {
    console.error('Error adding sponsor:', error);
    res.status(500).json({ success: false, message: 'Error adding sponsor' });
  }
});

// Protected: Get all partners
router.get('/partners', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM partners ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching partners' });
  }
});

// Protected: Add a new partner
router.post('/partners', verifyAdmin, upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, role, org, tags } = req.body;
    if (!name || !role || !org) return res.status(400).json({ success: false, message: 'Name, Role, and Org are required' });
    const profilePic = req.file ? `/uploads/nominations/${req.file.filename}` : null;
    await pool.query(
      'INSERT INTO partners (name, role, org, tags, photo_url) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), role.trim(), org.trim(), tags || null, profilePic]
    );
    res.json({ success: true, message: 'Partner added successfully!' });
  } catch (error) {
    console.error('Error adding partner:', error);
    res.status(500).json({ success: false, message: 'Error adding partner' });
  }
});

// Protected: Get all jury
router.get('/jury', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jury ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching jury' });
  }
});

// Protected: Add a new jury
router.post('/jury', verifyAdmin, upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, role, org, tags } = req.body;
    if (!name || !role || !org) return res.status(400).json({ success: false, message: 'Name, Role, and Org are required' });
    const profilePic = req.file ? `/uploads/nominations/${req.file.filename}` : null;
    await pool.query(
      'INSERT INTO jury (name, role, org, tags, photo_url) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), role.trim(), org.trim(), tags || null, profilePic]
    );
    res.json({ success: true, message: 'Jury added successfully!' });
  } catch (error) {
    console.error('Error adding jury:', error);
    res.status(500).json({ success: false, message: 'Error adding jury' });
  }
});

// Protected: Update a single nomination status (and send email if winning)
router.patch('/nominations/:id/status', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ success: false, message: 'Nomination ID and status are required' });
  }

  try {
    // 1. Get current nomination details before update (to send email if they become a winner)
    const [nomRows] = await pool.query(
      `SELECT n.nominee_name, n.business_name, n.email, ac.name AS category, n.voting_url, n.status AS old_status
       FROM nominations n
       LEFT JOIN award_categories ac ON n.category_id = ac.id
       WHERE n.id = ?`,
      [id]
    );

    if (nomRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }

    const nominee = nomRows[0];

    // 2. Update status in the database
    await pool.query('UPDATE nominations SET status = ? WHERE id = ?', [status, id]);

    // 3. If they are changed to a winner, send the celebration email
    if (status === 'winner' && nominee.old_status !== 'winner' && nominee.email) {
      try {
        await fetch(`http://localhost:5000/api/send-winner-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: nominee.email,
            nomineeName: nominee.nominee_name,
            companyName: nominee.business_name,
            category: nominee.category,
            votingUrl: nominee.voting_url
          })
        });
        console.log(`Celebration email triggered for nominee ${nominee.nominee_name}`);
      } catch (emailErr) {
        console.error('Failed to trigger celebration email:', emailErr.message);
      }
    }

    // 4. If they are changed to approved, send the approval email
    if (status === 'approved' && nominee.old_status !== 'approved' && nominee.email) {
      try {
        await fetch(`http://localhost:5000/api/send-approval`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: nominee.email,
            nomineeName: nominee.nominee_name,
            companyName: nominee.business_name,
            category: nominee.category,
            votingUrl: nominee.voting_url
          })
        });
        console.log(`Approval email triggered for nominee ${nominee.nominee_name}`);
      } catch (emailErr) {
        console.error('Failed to trigger approval email:', emailErr.message);
      }
    }

    res.json({ success: true, message: 'Status updated successfully!' });
  } catch (error) {
    console.error('Error updating nomination status:', error);
    res.status(500).json({ success: false, message: 'Error updating nomination status' });
  }
});

// Protected: Update multiple nominations status
router.patch('/nominations/bulk-status', verifyAdmin, async (req, res) => {
  const { ids, status } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  try {
    if (status === 'winner' || status === 'approved') {
      const [nominees] = await pool.query(
        `SELECT n.id, n.nominee_name, n.business_name, n.email, ac.name AS category, n.voting_url, n.status AS old_status
         FROM nominations n
         LEFT JOIN award_categories ac ON n.category_id = ac.id
         WHERE n.id IN (?)`,
        [ids]
      );
      
      await pool.query('UPDATE nominations SET status = ? WHERE id IN (?)', [status, ids]);

      const endpoint = status === 'winner' ? 'send-winner-email' : 'send-approval';

      for (const nominee of nominees) {
        if (nominee.old_status !== status && nominee.email) {
          try {
            await fetch(`http://localhost:5000/api/${endpoint}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: nominee.email,
                nomineeName: nominee.nominee_name,
                companyName: nominee.business_name,
                category: nominee.category,
                votingUrl: nominee.voting_url
              })
            });
          } catch (emailErr) {
            console.error(`Failed to send bulk ${status} email to ${nominee.email}:`, emailErr.message);
          }
        }
      }
    } else {
      await pool.query('UPDATE nominations SET status = ? WHERE id IN (?)', [status, ids]);
    }

    res.json({ success: true, message: 'Selected nominations updated successfully!' });
  } catch (error) {
    console.error('Error in bulk status update:', error);
    res.status(500).json({ success: false, message: 'Error in bulk status update' });
  }
});

// Protected: Update a nomination's profile picture or details
router.patch('/nominations/:id', verifyAdmin, upload.single('profilePicture'), async (req, res) => {
  const { id } = req.params;
  const { nominee_name, business_name, description, city, phone, email } = req.body;

  try {
    let updateFields = [];
    let queryParams = [];

    if (nominee_name !== undefined) {
      updateFields.push('nominee_name = ?');
      queryParams.push(nominee_name.trim());
    }
    if (business_name !== undefined) {
      updateFields.push('business_name = ?');
      queryParams.push(business_name.trim());
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      queryParams.push(description.trim());
    }
    if (city !== undefined) {
      updateFields.push('city = ?');
      queryParams.push(city.trim());
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      queryParams.push(phone.trim());
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      queryParams.push(email.trim().toLowerCase());
    }

    if (req.file) {
      const profilePic = `/uploads/nominations/${req.file.filename}`;
      updateFields.push('profile_picture = ?');
      queryParams.push(profilePic);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    queryParams.push(id);
    await pool.query(
      `UPDATE nominations SET ${updateFields.join(', ')} WHERE id = ?`,
      queryParams
    );

    res.json({ success: true, message: 'Nomination updated successfully!' });
  } catch (error) {
    console.error('Error updating nomination details:', error);
    res.status(500).json({ success: false, message: 'Error updating nomination details' });
  }
});

// Protected: Bulk delete records
router.post('/bulk-delete', verifyAdmin, async (req, res) => {
  const { ids, type, winners } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0 || !type) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  try {
    if (type === 'winners' && winners && Array.isArray(winners)) {
      for (const w of winners) {
        if (w.source === 'nomination') {
          await pool.query('UPDATE nominations SET status = "approved" WHERE id = ?', [w.id]);
        } else {
          await pool.query('DELETE FROM winners WHERE id = ?', [w.id]);
        }
      }
    } else {
      let table = '';
      if (type === 'events') table = 'event_registrations';
      else if (type === 'sponsorships') table = 'sponsorships';
      else if (type === 'membership') table = 'community_applications';
      else if (type === 'gallery-sponsors') table = 'sponsors';
      else if (type === 'partners') table = 'partners';
      else if (type === 'jury') table = 'jury';
      else table = 'inquiries';

      await pool.query(`DELETE FROM ${table} WHERE id IN (?)`, [ids]);
    }

    res.json({ success: true, message: 'Selected records deleted successfully!' });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    res.status(500).json({ success: false, message: 'Error in bulk delete' });
  }
});

// Protected: List all admin users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin' && req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active, last_login, created_at FROM admin_users ORDER BY id DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Protected: Create new admin user
router.post('/users', verifyAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin' && req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );

    res.status(201).json({ success: true, message: 'Admin user created successfully.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email address already registered.' });
    }
    console.error('Failed to create admin user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Protected: Toggle is_active status of an admin user
router.post('/users/:id/toggle-status', verifyAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin' && req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const userId = parseInt(req.params.id);
    if (userId === req.admin.id) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
    }

    // Get current status
    const [rows] = await pool.query('SELECT is_active FROM admin_users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    const newStatus = rows[0].is_active ? 0 : 1;
    await pool.query('UPDATE admin_users SET is_active = ? WHERE id = ?', [newStatus, userId]);

    res.json({ success: true, data: { is_active: newStatus }, message: `Admin user ${newStatus ? 'activated' : 'deactivated'} successfully.` });
  } catch (error) {
    console.error('Failed to toggle admin user status:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Protected: Delete admin user
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin' && req.admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    const userId = parseInt(req.params.id);
    if (userId === req.admin.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const [result] = await pool.query('DELETE FROM admin_users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    res.json({ success: true, message: 'Admin user deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete admin user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Protected: Get voters list for a nominee
router.get('/nominations/:id/votes', verifyAdmin, async (req, res) => {
  try {
    const nominationId = parseInt(req.params.id);
    if (!Number.isInteger(nominationId) || nominationId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid nomination ID' });
    }
    const [rows] = await pool.query(
      `SELECT voter_name, voter_email, voter_business, voter_designation, voter_phone, voter_city, voter_remarks, created_at 
       FROM nomination_votes 
       WHERE nomination_id = ? 
       ORDER BY created_at DESC`,
      [nominationId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Failed to fetch nomination votes details:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
