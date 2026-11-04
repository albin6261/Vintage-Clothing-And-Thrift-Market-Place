import express from 'express';
import { pool } from '../db/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cart - get cart items for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [items] = await pool.query(`
      SELECT 
        ci.id AS cart_item_id,
        ci.quantity,
        p.id AS product_id,
        p.title,
        p.slug,
        p.brand,
        p.price,
        p.size,
        p.condition_status,
        p.is_one_of_one,
        p.stock_quantity,
        p.image_url,
        p.status
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]);

    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    res.json({
      items,
      subtotal,
      itemCount: items.length,
    });
  } catch (error) {
    console.error('Fetch cart error:', error);
    res.status(500).json({ error: 'Failed to retrieve cart items.' });
  }
});

// POST /api/cart - add or update item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    // Check product existence and status
    const [prods] = await pool.query('SELECT id, is_one_of_one, stock_quantity, status FROM products WHERE id = ?', [productId]);
    if (prods.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const prod = prods[0];
    if (prod.status !== 'approved') {
      return res.status(400).json({ error: 'This item is no longer available.' });
    }

    // For one of one vintage items, quantity can only be 1
    const qtyToSet = prod.is_one_of_one ? 1 : Math.max(1, parseInt(quantity));

    // Upsert into cart_items
    await pool.query(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
    `, [userId, productId, qtyToSet]);

    res.json({ message: 'Item added to bag successfully.' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to update shopping bag.' });
  }
});

// DELETE /api/cart/:productId - remove item
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await pool.query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId]);

    res.json({ message: 'Item removed from bag.' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ error: 'Failed to remove item.' });
  }
});

// DELETE /api/cart - clear all
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    res.json({ message: 'Cart cleared.' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
});

export default router;
