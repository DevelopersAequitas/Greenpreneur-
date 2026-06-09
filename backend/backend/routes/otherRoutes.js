// =============================================================================
// Route: /api/coffee-book
// =============================================================================
import { Router as CoffeeRouter } from 'express';
import db from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const coffeeRouter = CoffeeRouter();

const PACKAGE_PRICES = {
  'Cover Story': 200000,
  'Back Cover': 50000,
  'Inside Front/Back Cover': 40000,
  'Full-Page Advertisement': 20000,
  'Inside Feature Story': 15000,
  'Green Editorial Spread': 10000,
  'Inside Feature (Members)': 5000,
  'Extra Print Copies': 300,
};

coffeeRouter.post('/', async (req, res) => {
  const { name, phone, email, company, package: pkg, quantity = 1, message } = req.body;

  if (!name?.trim() || !phone?.trim() || !email?.trim() || !company?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, phone, email, company are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const selectedPkg = PACKAGE_PRICES[pkg] !== undefined ? pkg : 'Inside Feature Story';
  const unitPrice = PACKAGE_PRICES[selectedPkg];
  const qty = selectedPkg === 'Extra Print Copies' ? Math.max(1, parseInt(quantity) || 1) : 1;
  const totalAmount = unitPrice * qty;

  try {
    const [result] = await db.query(
      `INSERT INTO coffee_table_book_orders
         (name, phone, email, company, package, quantity, package_price, total_amount, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), phone.trim(), email.trim().toLowerCase(), company.trim(),
       selectedPkg, qty, unitPrice, totalAmount, message?.trim() || null]
    );

    // Trigger Zoho email confirmation asynchronously
    try {
      await fetch('http://localhost:3000/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          type: 'Coffee Table Book Inquiry',
          details: {
            Company: company.trim(),
            Phone: phone,
            Package: selectedPkg,
            Quantity: qty,
            'Total Amount': `₹${totalAmount}`,
            Message: message || 'N/A'
          }
        })
      });
    } catch (emailErr) {
      console.error('Failed to send coffee book confirmation email:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Coffee Table Book enquiry submitted successfully.',
      data: { id: result.insertId, package: selectedPkg, totalAmount },
    });
  } catch (err) {
    console.error('[coffee-book POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit book enquiry' });
  }
});


// =============================================================================
// Route: /api/contact
// =============================================================================
import { Router as ContactRouter } from 'express';

export const contactRouter = ContactRouter();

const VALID_INTERESTS = ['Awards', 'Sponsorship', 'Book', 'Exhibition', 'Speaking', 'General'];

contactRouter.post('/', async (req, res) => {
  const { name, phone, email, interest, message } = req.body;

  if (!name?.trim() || !phone?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, phone, email and message are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const selectedInterest = VALID_INTERESTS.includes(interest) ? interest : 'General';

  try {
    const [result] = await db.query(
      `INSERT INTO contact_enquiries (name, phone, email, interest, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), phone.trim(), email.trim().toLowerCase(), selectedInterest, message.trim()]
    );

    // Trigger Zoho email confirmation asynchronously
    try {
      await fetch('http://localhost:3000/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          type: 'Contact Inquiry',
          details: {
            Phone: phone,
            Interest: selectedInterest,
            Message: message.trim()
          }
        })
      });
    } catch (emailErr) {
      console.error('Failed to send contact confirmation email:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will respond within 24 hours.',
      data: { id: result.insertId },
    });
  } catch (err) {
    console.error('[contact POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});


// =============================================================================
// Route: /api/community
// =============================================================================
import { Router as CommunityRouter } from 'express';

// Multer setup for community applications file uploads
const communityUploadDir = path.join(process.cwd(), 'uploads', 'community');
if (!fs.existsSync(communityUploadDir)) {
  fs.mkdirSync(communityUploadDir, { recursive: true });
}

const communityStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, communityUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const communityUpload = multer({ 
  storage: communityStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const communityRouter = CommunityRouter();

communityRouter.post('/apply', communityUpload.fields([{ name: 'promoterImage', maxCount: 1 }, { name: 'organizationLogo', maxCount: 1 }]), async (req, res) => {
  const { name, email, phone, city, company, website, sector, whyJoin } = req.body;

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !company?.trim() || !whyJoin?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, company and motivation are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const promoterImage = req.files?.promoterImage?.[0]?.filename 
    ? `/uploads/community/${req.files.promoterImage[0].filename}` 
    : null;
  const organizationLogo = req.files?.organizationLogo?.[0]?.filename 
    ? `/uploads/community/${req.files.organizationLogo[0].filename}` 
    : null;

  try {
    const [result] = await db.query(
      `INSERT INTO community_applications
         (name, email, phone, city, company, website, sector, interest, why_join, promoter_image, organization_logo, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        name.trim(), 
        email.trim().toLowerCase(), 
        phone.trim(), 
        city?.trim() || '',
        company.trim(), 
        website?.trim() || null,
        sector || 'General', 
        'Membership', 
        whyJoin.trim(), 
        promoterImage, 
        organizationLogo
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Community application submitted. Welcome to the Greenpreneur network!',
      data: { 
        id: result.insertId,
        amount: 2500,
        status: 'pending'
      },
    });
  } catch (err) {
    console.error('[community POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit community application' });
  }
});


// =============================================================================
// Route: /api/winners
// =============================================================================
import { Router as WinnersRouter } from 'express';

export const winnersRouter = WinnersRouter();

// GET /api/winners?category=waste-management&limit=9&offset=0
winnersRouter.get('/', async (req, res) => {
  const { category, limit = 9, offset = 0 } = req.query;

  let query = `
    SELECT id, name, company, city, award_year, track, impact_text, quote, photo_url, is_featured, category, category_slug, website_link
    FROM (
      SELECT w.id, w.name, w.company, w.city, COALESCE(w.award_year, '2024') AS award_year, w.track,
             w.impact_text, w.quote, w.photo_url, w.is_featured,
             ac.name AS category, ac.slug AS category_slug, w.website_url AS website_link
      FROM winners w
      JOIN award_categories ac ON w.category_id = ac.id
      WHERE w.is_published = 1

      UNION ALL

      SELECT n.id, n.nominee_name AS name, n.business_name AS company, n.city, COALESCE(n.award_year, '2025') AS award_year, n.track,
             n.description AS impact_text, '' AS quote, n.profile_picture AS photo_url, 0 AS is_featured,
             ac.name AS category, ac.slug AS category_slug, n.website_link
      FROM nominations n
      JOIN award_categories ac ON n.category_id = ac.id
      WHERE n.status = 'winner'
    ) combined
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category_slug = ?';
    params.push(category);
  }
  query += ' ORDER BY award_year DESC, name ASC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  try {
    const [rows] = await db.query(query, params);
    
    // Also get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM (
        SELECT ac.slug AS category_slug
        FROM winners w
        JOIN award_categories ac ON w.category_id = ac.id
        WHERE w.is_published = 1

        UNION ALL

        SELECT ac.slug AS category_slug
        FROM nominations n
        JOIN award_categories ac ON n.category_id = ac.id
        WHERE n.status = 'winner'
      ) combined
      WHERE 1=1
    `;
    const countParams = [];
    if (category && category !== 'all') {
      countQuery += ' AND category_slug = ?';
      countParams.push(category);
    }
    const [countRows] = await db.query(countQuery, countParams);

    return res.json({ success: true, data: rows, total: countRows[0].total });
  } catch (err) {
    console.error('[winners GET]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch winners' });
  }
});
