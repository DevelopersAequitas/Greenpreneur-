import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import db from '../config/db.js';

const router = express.Router();

// Helper to initialize Razorpay (checks for keys)
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/**
 * POST /api/payment/create-order
 * Body: { amount: number, receipt: string, notes: object }
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const rzp = getRazorpayInstance();

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await rzp.orders.create(options);
    
    res.status(201).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('[Payment Error] create-order:', error);
    let errorMessage = 'Payment order creation failed';
    if (error.error && error.error.description) {
      errorMessage = error.error.description;
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
});

/**
 * POST /api/payment/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, module, record_id }
 */
router.post('/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      module, 
      record_id 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment parameters' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Payment is valid! Update the database based on the module
    let tableName = '';
    
    switch (module) {
      case 'nominations':
        tableName = 'nominations';
        break;
      case 'events':
        tableName = 'event_registrations';
        break;
      case 'sponsorships':
        tableName = 'sponsorships';
        break;
      case 'coffee-book':
        tableName = 'coffee_table_book_orders';
        break;
      case 'community':
        tableName = 'community_applications';
        break;
      default:
        // Verification succeeded but no DB update requested
        return res.json({ success: true, message: 'Payment verified without DB update' });
    }

    // Mark as paid
    let result;
    if (module === 'sponsorships') {
      const [resUpdate] = await db.query(
        `UPDATE sponsorships SET payment_received = 1, payment_ref = ?, status = 'confirmed' WHERE id = ?`,
        [razorpay_payment_id, record_id]
      );
      result = resUpdate;
    } else {
      const [resUpdate] = await db.query(
        `UPDATE ?? SET payment_status = 'paid', payment_ref = ? WHERE id = ?`,
        [tableName, razorpay_payment_id, record_id]
      );
      result = resUpdate;
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Payment verified, but record not found' });
    }

    if (module === 'nominations') {
      try {
        const [rows] = await db.query(
          `SELECT n.nominee_name, n.business_name, n.email, n.phone, n.website_link, n.track, n.voting_url, ac.name AS category_name
           FROM nominations n
           LEFT JOIN award_categories ac ON n.category_id = ac.id
           WHERE n.id = ?`,
          [record_id]
        );
        if (rows.length > 0) {
          const nom = rows[0];
          await fetch(`http://localhost:5000/api/send-nomination`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              track: nom.track,
              category: nom.category_name,
              nomineeName: nom.nominee_name,
              companyName: nom.business_name,
              email: nom.email,
              phone: nom.phone,
              website: nom.website_link,
              votingUrl: nom.voting_url || ''
            })
          });
          console.log(`Payment confirmed: nomination email triggered for ${nom.nominee_name}`);
        }
      } catch (emailErr) {
        console.error('Failed to trigger nomination email after payment verification:', emailErr.message);
      }
    }

    if (module === 'community') {
      try {
        const [rows] = await db.query(
          `SELECT name, email, phone, city, company, website, sector, why_join
           FROM community_applications
           WHERE id = ?`,
          [record_id]
        );
        if (rows.length > 0) {
          const app = rows[0];
          await fetch(`http://localhost:5000/api/send-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: app.email,
              name: app.name,
              type: 'Community Membership Confirmation',
              details: {
                Company: app.company,
                Phone: app.phone,
                City: app.city || 'N/A',
                Website: app.website || 'N/A',
                Sector: app.sector || 'General',
                Interest: 'Membership (Paid ₹2,500)',
                'Why Join': app.why_join
              }
            })
          });
          console.log(`Payment confirmed: community email triggered for ${app.name}`);
        }
      } catch (emailErr) {
        console.error('Failed to trigger community confirmation email after payment verification:', emailErr.message);
      }
    }

    if (module === 'events') {
      try {
        const [rows] = await db.query(
          `SELECT name, email, phone, city, segment, pass_type, pass_amount
           FROM event_registrations
           WHERE id = ?`,
          [record_id]
        );
        if (rows.length > 0) {
          const reg = rows[0];
          await fetch(`http://localhost:5000/api/send-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: reg.email,
              name: reg.name,
              type: 'Event Pass Registration',
              details: {
                Phone: reg.phone,
                City: reg.city || 'N/A',
                Segment: reg.segment || 'Green Entrepreneur',
                'Pass Type': reg.pass_type,
                Amount: `₹${reg.pass_amount} (Paid via Razorpay)`
              }
            })
          });
          console.log(`Payment confirmed: event registration email triggered for ${reg.name}`);
        }
      } catch (emailErr) {
        console.error('Failed to trigger event registration email after payment verification:', emailErr.message);
      }
    }

    res.json({ success: true, message: 'Payment verified and updated successfully' });
  } catch (error) {
    console.error('[Payment Error] verify:', error);
    res.status(500).json({ success: false, message: 'Verification process failed' });
  }
});

export default router;
