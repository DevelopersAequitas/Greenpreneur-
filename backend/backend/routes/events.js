// =============================================================================
// Route: /api/events
// Handles event pass registrations from Event2026.tsx
// =============================================================================
import { Router } from 'express';
import db from '../config/db.js';
import Razorpay from 'razorpay';

const router = Router();

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

router.post('/register', async (req, res) => {
  const { name, email, phone, city, segment, pass_type, pass_amount } = req.body;

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email and phone are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const amount = parseFloat(pass_amount) || 0;

  try {
    const [result] = await db.query(
      `INSERT INTO event_registrations (name, email, phone, city, segment, pass_type, pass_amount, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        city?.trim() || '',
        segment || 'Green Entrepreneur',
        pass_type || 'Delegate (Without Dinner)',
        amount,
        amount > 0 ? 'pending' : 'complimentary'
      ]
    );

    const recordId = result.insertId;

    // Trigger Zoho email confirmation asynchronously if it's a free pass
    if (amount === 0) {
      try {
        await fetch('http://localhost:5000/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            name: name.trim(),
            type: 'Event Pass Registration',
            details: {
              Phone: phone,
              City: city || 'N/A',
              Segment: segment || 'Green Entrepreneur',
              'Pass Type': pass_type || 'General Pass',
              Amount: 'Free'
            }
          })
        });
      } catch (emailErr) {
        console.error('Failed to send event confirmation email:', emailErr.message);
      }

      return res.status(201).json({
        success: true,
        requiresPayment: false,
        message: 'Event registration successful',
        data: { id: recordId, event: 'Greenpreneur 2026', date: '2026-06-25' },
      });
    }

    // Otherwise, create a Razorpay order
    const rzp = getRazorpayInstance();
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: `event_reg_${recordId}`,
      notes: {
        module: 'events',
        record_id: String(recordId)
      }
    };

    const order = await rzp.orders.create(options);

    return res.status(201).json({
      success: true,
      requiresPayment: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
      registrationId: recordId
    });

  } catch (err) {
    console.error('[events POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to register for event' });
  }
});

export default router;
