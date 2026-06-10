// =============================================================================
// Router: Voice of Greenpreneur API
// File: backend/routes/voiceVideos.js
// =============================================================================

import express from 'express';
import pool from '../config/db.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public Routes ────────────────────────────────────────────────────────────

// 1. Get all active videos for public display (sorted by sort_order ASC, then created_at DESC)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, youtube_id, title, sort_order, created_at FROM voice_videos WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching voice videos:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
});

// ── Protected Admin Routes ───────────────────────────────────────────────────

// 2. Get all videos (both active and inactive) for admin panel management
router.get('/admin', verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM voice_videos ORDER BY sort_order ASC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching admin voice videos:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
});

// 3. Fetch details from YouTube oEmbed API when admin pastes a URL
router.get('/oembed-info', verifyAdmin, async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL query parameter is required' });
    }

    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    
    // Node.js native fetch (supported since Node 18+)
    const fetchRes = await fetch(oembedUrl);
    if (!fetchRes.ok) {
      throw new Error('Failed to resolve YouTube video information');
    }
    const data = await fetchRes.json();

    res.json({
      success: true,
      title: data.title,
      thumbnail: data.thumbnail_url,
      author: data.author_name
    });
  } catch (error) {
    console.error('oEmbed info fetching error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Could not fetch video info. Ensure the YouTube link is valid and public.' 
    });
  }
});

// 4. Add a new video
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { youtube_id, title, is_active } = req.body;
    if (!youtube_id || !title) {
      return res.status(400).json({ success: false, message: 'YouTube ID and Title are required' });
    }

    // Determine the next sort_order index (MAX + 1)
    const [orderRow] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM voice_videos');
    const nextOrder = orderRow[0].next_order;
    const activeFlag = is_active !== undefined ? is_active : 1;

    const [result] = await pool.query(
      'INSERT INTO voice_videos (youtube_id, title, sort_order, is_active) VALUES (?, ?, ?, ?)',
      [youtube_id, title, nextOrder, activeFlag]
    );

    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      data: { id: result.insertId, youtube_id, title, sort_order: nextOrder, is_active: activeFlag }
    });
  } catch (error) {
    console.error('Error adding voice video:', error);
    res.status(500).json({ success: false, message: 'Failed to add video' });
  }
});

// 5. Update existing video (Title, Active Status, or Reordering Index)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_active, sort_order } = req.body;

    // Verify it exists
    const [existing] = await pool.query('SELECT * FROM voice_videos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const current = existing[0];
    const updateTitle = title !== undefined ? title : current.title;
    const updateActive = is_active !== undefined ? is_active : current.is_active;
    const updateOrder = sort_order !== undefined ? sort_order : current.sort_order;

    await pool.query(
      'UPDATE voice_videos SET title = ?, is_active = ?, sort_order = ? WHERE id = ?',
      [updateTitle, updateActive, updateOrder, id]
    );

    res.json({
      success: true,
      message: 'Video updated successfully',
      data: { id, title: updateTitle, is_active: updateActive, sort_order: updateOrder }
    });
  } catch (error) {
    console.error('Error updating voice video:', error);
    res.status(500).json({ success: false, message: 'Failed to update video' });
  }
});

// 6. Bulk reorder videos
router.put('/admin/reorder', verifyAdmin, async (req, res) => {
  const { orders } = req.body; // Expects array of { id, sort_order }
  if (!Array.isArray(orders)) {
    return res.status(400).json({ success: false, message: 'Orders array is required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of orders) {
      await connection.query('UPDATE voice_videos SET sort_order = ? WHERE id = ?', [item.sort_order, item.id]);
    }
    await connection.commit();
    res.json({ success: true, message: 'Reordering completed successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error reordering videos:', error);
    res.status(500).json({ success: false, message: 'Failed to reorder videos' });
  } finally {
    connection.release();
  }
});

// 7. Delete video
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM voice_videos WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    await pool.query('DELETE FROM voice_videos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting voice video:', error);
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
});

export default router;
