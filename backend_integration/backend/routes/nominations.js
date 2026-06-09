// =============================================================================
// Route: /api/nominations
// Handles award application submissions from ApplyAward.tsx
// =============================================================================

import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// ── POST /api/nominations ─────────────────────────────────────────────────────
// Submit a new award nomination (all 4 wizard steps combined on final submit)
router.post('/', async (req, res) => {
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
      packageValue = ['standard', 'premium'].includes(pkg) ? pkg : 'standard';
      packageAmount = packageValue === 'premium' ? 5000.00 : 2000.00;
    }

    // Insert nomination
    const [result] = await conn.query(
      `INSERT INTO nominations
        (track, nominee_name, business_name, phone, email, city,
         category_id, description, website_link,
         package, package_amount, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
         'pending',
         ?)`,
      [
        track, name.trim(), business.trim(), phone.trim(), email.trim().toLowerCase(),
        city.trim(), categoryId, description.trim(), link?.trim() || null,
        packageValue, packageAmount,
        track === 'honorary' ? 'not_applicable' : 'pending',
      ]
    );

    const nominationId = result.insertId;

    // Audit log
    await conn.query(
      `INSERT INTO audit_log (table_name, record_id, action, new_values)
       VALUES ('nominations', ?, 'INSERT', ?)`,
      [nominationId, JSON.stringify({ track, email, category, business })]
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
      },
    });
  } catch (err) {
    console.error('[nominations POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit nomination' });
  } finally {
    conn.release();
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

export default router;
