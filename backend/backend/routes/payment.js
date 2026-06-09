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
      default:
        // Verification succeeded but no DB update requested
        return res.json({ success: true, message: 'Payment verified without DB update' });
    }

    // Mark as paid
    const [result] = await db.query(
      `UPDATE ?? SET payment_status = 'paid', payment_ref = ? WHERE id = ?`,
      [tableName, razorpay_payment_id, record_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Payment verified, but record not found' });
    }

    res.json({ success: true, message: 'Payment verified and updated successfully' });
  } catch (error) {
    console.error('[Payment Error] verify:', error);
    res.status(500).json({ success: false, message: 'Verification process failed' });
  }
});

export default router;
