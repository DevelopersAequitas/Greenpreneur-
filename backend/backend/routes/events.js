// =============================================================================
// Route: /api/events
// Handles event pass registrations from Event2026.tsx
// =============================================================================
import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, phone, city, segment } = req.body;

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email and phone are required' });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO event_registrations (name, email, phone, city, segment)
       VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), email.trim().toLowerCase(), phone.trim(), city?.trim() || '', segment || 'Green Entrepreneur']
    );

    // Trigger Zoho email confirmation asynchronously
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
            Segment: segment || 'Green Entrepreneur'
          }
        })
      });
    } catch (emailErr) {
      console.error('Failed to send event confirmation email:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Event registration successful',
      data: { id: result.insertId, event: 'Greenpreneur 2026', date: '2026-06-25' },
    });
  } catch (err) {
    console.error('[events POST]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to register for event' });
  }
});

export default router;
