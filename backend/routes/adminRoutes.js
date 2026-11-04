import express from 'express';
import { pool } from '../db/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply admin guard to all routes in this router
router.use(authenticateToken, requireRole(['admin']));

// GET /api/admin/stats - overview metrics
router.get('/stats', async (req, res) => {
  try {
    const [salesRow] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) AS total_revenue, COUNT(*) AS total_orders FROM orders WHERE status != "cancelled"');
    const [productsRow] = await pool.query(`
      SELECT 
        COUNT(*) AS total_products,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS active_products,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_approvals,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) AS sold_products
      FROM products
    `);
    const [usersRow] = await pool.query(`
      SELECT 
        COUNT(*) AS total_users,
        SUM(CASE WHEN role = 'seller' THEN 1 ELSE 0 END) AS sellers_count,
        SUM(CASE WHEN role = 'buyer' THEN 1 ELSE 0 END) AS buyers_count
      FROM users
    `);

    res.json({
      metrics: {
        totalRevenue: Number(salesRow[0]?.total_revenue || 0),
        totalOrders: salesRow[0]?.total_orders || 0,
        totalProducts: productsRow[0]?.total_products || 0,
        activeProducts: productsRow[0]?.active_products || 0,
        pendingApprovals: productsRow[0]?.pending_approvals || 0,
        soldProducts: productsRow[0]?.sold_products || 0,
        totalUsers: usersRow[0]?.total_users || 0,
        sellersCount: usersRow[0]?.sellers_count || 0,
        buyersCount: usersRow[0]?.buyers_count || 0,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve admin stats.' });
  }
});

// GET /api/admin/products/pending - list pending items needing approval
router.get('/products/pending', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, c.name AS category_name, u.name AS seller_name, u.email AS seller_email
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'pending'
      ORDER BY p.created_at ASC
    `);

    const formatted = products.map(p => ({
      ...p,
      is_one_of_one: Boolean(p.is_one_of_one),
      measurements: typeof p.measurements === 'string' ? JSON.parse(p.measurements) : p.measurements,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    }));

    res.json({ pendingProducts: formatted });
  } catch (error) {
    console.error('Pending products error:', error);
    res.status(500).json({ error: 'Failed to retrieve pending products.' });
  }
});

// PATCH /api/admin/products/:id/status - approve, reject, or mark status
router.patch('/products/:id/status', async (req, res) => {
  try {
    const { status, featured, is_new_arrival } = req.body;
    const productId = req.params.id;

    const updates = [];
    const params = [];

    if (status && ['approved', 'rejected', 'pending', 'sold'].includes(status)) {
      updates.push('status = ?');
      params.push(status);
    }

    if (typeof featured !== 'undefined') {
      updates.push('featured = ?');
      params.push(featured ? 1 : 0);
    }

    if (typeof is_new_arrival !== 'undefined') {
      updates.push('is_new_arrival = ?');
      params.push(is_new_arrival ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid update fields provided.' });
    }

    params.push(productId);
    await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params);

    res.json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({ error: 'Failed to update product status.' });
  }
});

// GET /api/admin/orders - all orders across the marketplace
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `);

    const formatted = orders.map(ord => ({
      ...ord,
      shipping_address: typeof ord.shipping_address === 'string' ? JSON.parse(ord.shipping_address) : ord.shipping_address,
    }));

    res.json({ orders: formatted });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve admin orders.' });
  }
});

// PATCH /api/admin/orders/:id/status - update order fulfillment status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const orderId = req.params.id;

    if (!['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid order status.' });
    }

    await pool.query(
      'UPDATE orders SET status = ?, tracking_number = COALESCE(?, tracking_number) WHERE id = ?',
      [status, trackingNumber || null, orderId]
    );

    res.json({ message: 'Order status updated successfully.' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;
