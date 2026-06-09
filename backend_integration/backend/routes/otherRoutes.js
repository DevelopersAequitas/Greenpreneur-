// =============================================================================
// Route: /api/coffee-book
// =============================================================================
import { Router as CoffeeRouter } from 'express';
import db from '../config/db.js';

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

export const communityRouter = CommunityRouter();

communityRouter.post('/apply', async (req, res) => {
  const { name, email, phone, city, company, sector, interest, whyJoin } = req.body;

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !company?.trim() || !whyJoin?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, company and motivation are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO community_applications
         (name, email, phone, city, company, sector, interest, why_join)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), email.trim().toLowerCase(), phone.trim(), city?.trim() || '',
       company.trim(), sector || 'General', interest || 'Membership', whyJoin.trim()]
    );
    return res.status(201).json({
      success: true,
      message: 'Community application submitted. Welcome to the Greenpreneur network!',
      data: { id: result.insertId },
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

// GET /api/winners?year=2025&category=waste-management
winnersRouter.get('/', async (req, res) => {
  const { year, category } = req.query;

  let query = `
    SELECT w.id, w.name, w.company, w.city, w.award_year, w.track,
           w.impact_text, w.quote, w.photo_url, w.is_featured,
           ac.name AS category, ac.slug AS category_slug
    FROM winners w
    JOIN award_categories ac ON w.category_id = ac.id
    WHERE w.is_published = 1
  `;
  const params = [];

  if (year && year !== 'all') {
    query += ' AND w.award_year = ?';
    params.push(parseInt(year));
  }
  if (category && category !== 'all') {
    query += ' AND ac.slug = ?';
    params.push(category);
  }
  query += ' ORDER BY w.award_year DESC, w.is_featured DESC, w.name ASC';

  try {
    const [rows] = await db.query(query, params);
    return res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    console.error('[winners GET]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch winners' });
  }
});
