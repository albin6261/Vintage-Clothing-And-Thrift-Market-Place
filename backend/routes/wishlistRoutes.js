import express from 'express';
import { pool } from '../db/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [items] = await pool.query(`
      SELECT 
        w.id AS wishlist_id,
        w.created_at AS added_at,
        p.id AS product_id,
        p.title,
        p.slug,
        p.brand,
        p.price,
        p.size,
        p.condition_status,
        p.is_one_of_one,
        p.image_url,
        p.status
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `, [userId]);

    res.json({ wishlist: items });
  } catch (error) {
    console.error('Fetch wishlist error:', error);
    res.status(500).json({ error: 'Failed to retrieve wishlist.' });
  }
});

// POST /api/wishlist/:productId - toggle wishlist
router.post('/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const [existing] = await pool.query(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);
      return res.json({ action: 'removed', message: 'Item removed from wishlist.' });
    } else {
      await pool.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, productId]);
      return res.json({ action: 'added', message: 'Item saved to wishlist.' });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ error: 'Failed to update wishlist.' });
  }
});

export default router;
