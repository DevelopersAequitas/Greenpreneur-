// =============================================================================
// Route: /api/nominations
// Handles award application submissions from ApplyAward.tsx
// =============================================================================

import { Router } from 'express';
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

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

const router = Router();

// ── POST /api/nominations ─────────────────────────────────────────────────────
// Submit a new award nomination (all 4 wizard steps combined on final submit)
router.post('/', upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'businessLogo', maxCount: 1 }]), async (req, res) => {
  const {
    track,          // 'honorary' | 'rated'
    name,           // nominee_name
    business,       // business_name
    phone,
    email,
    city,
    category,       // category name string → we resolve to ID
    description,
    link,           // optional website
    package: pkg,   // 'standard' | 'premium' | null
  } = req.body;

  // ── Basic validation ──────────────────────────────────────────────────────
  const required = { name, business, phone, email, city, category, description };
  const missing = Object.entries(required).filter(([, v]) => !v?.trim()).map(([k]) => k);
  if (missing.length) {
    return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
  if (!['honorary', 'rated'].includes(track)) {
    return res.status(400).json({ success: false, message: 'Invalid track' });
  }

  const conn = await db.getConnection();
  try {
    // Resolve category name → ID
    const [catRows] = await conn.query(
      'SELECT id FROM award_categories WHERE name = ? AND is_active = 1',
      [category]
    );
    if (!catRows.length) {
      return res.status(400).json({ success: false, message: 'Invalid award category' });
    }
    const categoryId = catRows[0].id;

    // Determine package amount
    let packageAmount = null;
    let packageValue = null;
    if (track === 'rated') {
      const validPackages = {
        'identity': 2000.00,
        'change_maker': 3000.00,
        'fame_india': 5000.00,
        'impact_creator': 10000.00
      };
      packageValue = validPackages[pkg] ? pkg : 'identity';
      packageAmount = validPackages[packageValue];
    }

    const profilePic = req.files?.profilePicture?.[0]?.filename ? `/uploads/nominations/${req.files.profilePicture[0].filename}` : null;
    const businessLogo = req.files?.businessLogo?.[0]?.filename ? `/uploads/nominations/${req.files.businessLogo[0].filename}` : null;

    // Insert nomination
    const [result] = await conn.query(
      `INSERT INTO nominations
        (track, nominee_name, business_name, phone, email, city,
         category_id, description, website_link,
         package, package_amount, status, payment_status, profile_picture, business_logo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         'pending',
         ?, ?, ?)`,
      [
        track, name.trim(), business.trim(), phone.trim(), email.trim().toLowerCase(),
        city.trim(), categoryId, description.trim(), link?.trim() || null,
        packageValue, packageAmount,
        track === 'honorary' ? 'not_applicable' : 'pending',
        profilePic, businessLogo
      ]
    );

    const nominationId = result.insertId;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const frontendUrl = req.headers.origin || 'http://localhost:5173';
    const votingUrl = `${frontendUrl}/vote/${nominationId}-${slug}`;

    await conn.query('UPDATE nominations SET voting_url = ? WHERE id = ?', [votingUrl, nominationId]);

    // Audit log
    await conn.query(
      `INSERT INTO audit_log (table_name, record_id, action, new_values)
       VALUES ('nominations', ?, 'INSERT', ?)`,
      [nominationId, JSON.stringify({ track, email, category, business, voting_url: votingUrl })]
    );

    return res.status(201).json({
      success: true,
      message: 'Nomination submitted successfully',
      data: {
        id: nominationId,
        track,
        category,
        package: packageValue,
        amount: packageAmount,
        status: 'pending',
        voting_url: votingUrl,
      },
    });
  } catch (err) {
    console.error('[nominations POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit nomination' });
  } finally {
    conn.release();
  }
});// ── GET /api/nominations/count ──────────────────────────────────────────────
// Returns the total count of nominations
router.get('/count', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM nominations');
    return res.json({ success: true, count: rows[0].count });
  } catch (err) {
    console.error('[nominations GET count]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch count' });
  }
});


// ── GET /api/nominations/categories ──────────────────────────────────────────
// Returns all active award categories (used to populate dropdown in the form)
router.get('/categories', async (_req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, slug, group_name FROM award_categories WHERE is_active = 1 ORDER BY group_name, name'
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[nominations GET categories]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});


// ── GET /api/nominations/pending ──────────────────────────────────────────────
// Returns all nominations with status = 'pending' or status = 'vetting'
router.get('/pending', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT n.id, n.nominee_name, n.profile_picture, n.status, ac.name AS category
       FROM nominations n
       JOIN award_categories ac ON n.category_id = ac.id
       WHERE n.status = 'pending' OR n.status = 'vetting'
       ORDER BY n.id DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[nominations GET pending]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch pending nominations' });
  }
});


// ── GET /api/nominations/:id ──────────────────────────────────────────────────
// Get single nomination status (for confirmation page tracking)
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }
  try {
    const [rows] = await db.query(
      `SELECT n.id, n.track, n.nominee_name, n.business_name, n.email,
              n.status, n.payment_status, n.award_year,
              ac.name AS category
       FROM nominations n
       JOIN award_categories ac ON n.category_id = ac.id
       WHERE n.id = ?`,
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[nominations GET id]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch nomination' });
  }
});


// ── GET /api/nominations/public/:id ───────────────────────────────────────────
// Public endpoint for the voting page
router.get('/public/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }
  try {
    const [rows] = await db.query(
      `SELECT n.id, n.nominee_name, n.business_name, n.description, n.status, ac.name AS category,
              n.profile_picture, n.business_logo,
              (SELECT COUNT(*) FROM nomination_votes WHERE nomination_id = n.id) AS vote_count
       FROM nominations n
       JOIN award_categories ac ON n.category_id = ac.id
       WHERE n.id = ?`,
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Nominee not found' });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[nominations GET public id]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch nominee' });
  }
});


// ── POST /api/nominations/:id/vote ───────────────────────────────────────────
// Submit a vote for a nominee
router.post('/:id/vote', async (req, res) => {
  const id = parseInt(req.params.id);
  const { email, name, business, designation, phone, city, remarks } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: 'Invalid ID' });
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required to vote' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  try {
    // Check if nominee exists and is not already a winner
    const [nominee] = await db.query('SELECT status FROM nominations WHERE id = ?', [id]);
    if (!nominee.length) {
      return res.status(404).json({ success: false, message: 'Nominee not found' });
    }
    if (nominee[0].status === 'winner') {
      return res.status(400).json({ success: false, message: 'Voting has closed for this nominee (They already won!)' });
    }

    // Insert vote with all fields
    await db.query(
      `INSERT INTO nomination_votes 
       (nomination_id, voter_email, voter_name, voter_business, voter_designation, voter_phone, voter_city, voter_remarks) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, 
        email.toLowerCase().trim(),
        name.trim(),
        business?.trim() || null,
        designation?.trim() || null,
        phone?.trim() || null,
        city?.trim() || null,
        remarks?.trim() || null
      ]
    );

    // Increment static public_votes counter to stay in sync
    await db.query('UPDATE nominations SET public_votes = public_votes + 1 WHERE id = ?', [id]);

    return res.status(201).json({ success: true, message: 'Vote submitted successfully!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'You have already voted for this nominee.' });
    }
    console.error('[nominations POST vote]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit vote' });
  }
});

export default router;
