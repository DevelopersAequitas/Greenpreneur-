import { Router } from 'express';
import db from '../config/db.js';

export const galleryRouter = Router();

// GET /api/gallery/sponsors
galleryRouter.get('/sponsors', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sponsors WHERE is_published = 1 ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[gallery GET sponsors]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch sponsors' });
  }
});

// GET /api/gallery/partners
galleryRouter.get('/partners', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM partners WHERE is_published = 1 ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[gallery GET partners]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch partners' });
  }
});

// GET /api/gallery/jury
galleryRouter.get('/jury', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jury WHERE is_published = 1 ORDER BY created_at DESC');
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[gallery GET jury]', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch jury' });
  }
});
