// =============================================================================
// Route: /api/sponsorships
// Handles sponsorship enquiries from Sponsorship.tsx
// =============================================================================
import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

const TIER_AMOUNTS = {
  'Title Sponsor': 200000,
  'Powered By': 100000,
  'Platinum Sponsor': 75000,
  'Gold Sponsor': 50000,
  'Silver Sponsor': 25000,
  'Category Sponsor': 10000,
  'Custom': null,
};

const VALID_TIERS = Object.keys(TIER_AMOUNTS);

router.post('/', async (req, res) => {
  const { name, company, email, phone, tier, message } = req.body;

  if (!name?.trim() || !company?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, company, email and phone are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const selectedTier = VALID_TIERS.includes(tier) ? tier : 'Gold Sponsor';
  const tierAmount = TIER_AMOUNTS[selectedTier];

  // Parse stall info from tier string if it contains stall keywords
  const stallInterest = message?.toLowerCase().includes('stall') ? 1 : 0;

  try {
    const [result] = await db.query(
      `INSERT INTO sponsorships
         (contact_name, company_name, email, phone, tier, tier_amount, stall_interest, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), company.trim(), email.trim().toLowerCase(), phone.trim(),
       selectedTier, tierAmount, stallInterest, message?.trim() || null]
    );
    return res.status(201).json({
      success: true,
      message: 'Sponsorship enquiry submitted. Our team will contact you within 24 hours.',
      data: { id: result.insertId, tier: selectedTier, amount: tierAmount },
    });
  } catch (err) {
    console.error('[sponsorships POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit sponsorship enquiry' });
  }
});

export default router;
