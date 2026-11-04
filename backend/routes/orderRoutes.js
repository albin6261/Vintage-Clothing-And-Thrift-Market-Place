import express from 'express';
import { pool } from '../db/db.js';
import { authenticateToken, optionalToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate vintage order reference
function generateOrderNumber() {
  const prefix = 'TF';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${randomNum}`;
}

// POST /api/orders - checkout with Cash on Delivery
router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const {
      shippingAddress,
      paymentMethod = 'Cash on Delivery',
      items = [],
      notes = '',
    } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city) {
      return res.status(400).json({ error: 'Complete shipping address is required.' });
    }

    // Begin database transaction
    await connection.beginTransaction();

    // If items are not passed in body, fetch from user's cart in DB
    let orderItems = items;
    if (!orderItems || orderItems.length === 0) {
      const [cartRows] = await connection.query(`
        SELECT ci.quantity, p.id AS product_id, p.price, p.is_one_of_one, p.stock_quantity, p.status, p.title
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
      `, [userId]);

      if (cartRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({ error: 'Your shopping bag is empty.' });
      }

      orderItems = cartRows;
    }

    // Verify stock availability
    let calculatedTotal = 0;
    const finalItems = [];

    for (const item of orderItems) {
      const pId = item.productId || item.product_id;
      const [pRows] = await connection.query('SELECT id, title, price, is_one_of_one, stock_quantity, status FROM products WHERE id = ? FOR UPDATE', [pId]);
      
      if (pRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({ error: `Product ID ${pId} not found.` });
      }

      const prod = pRows[0];
      if (prod.status === 'sold') {
        await connection.rollback();
        return res.status(400).json({ error: `"${prod.title}" was just purchased by another collector and is no longer available.` });
      }

      const qty = item.quantity || 1;
      calculatedTotal += Number(prod.price) * qty;

      finalItems.push({
        product_id: prod.id,
        price: prod.price,
        quantity: qty,
        is_one_of_one: prod.is_one_of_one,
      });
    }

    const orderNumber = generateOrderNumber();

    // Insert order
    const [orderResult] = await connection.query(`
      INSERT INTO orders 
      (order_number, user_id, total_amount, payment_method, payment_status, status, shipping_address, notes)
      VALUES (?, ?, ?, ?, 'Pending (COD)', 'confirmed', ?, ?)
    `, [
      orderNumber,
      userId,
      calculatedTotal,
      paymentMethod,
      JSON.stringify(shippingAddress),
      notes || null,
    ]);

    const orderId = orderResult.insertId;

    // Insert order_items and update product stock / one-of-one status
    for (const fItem of finalItems) {
      await connection.query(`
        INSERT INTO order_items (order_id, product_id, price, quantity)
        VALUES (?, ?, ?, ?)
      `, [orderId, fItem.product_id, fItem.price, fItem.quantity]);

      // If one of one, mark as sold
      if (fItem.is_one_of_one) {
        await connection.query('UPDATE products SET status = "sold", stock_quantity = 0 WHERE id = ?', [fItem.product_id]);
      } else {
        await connection.query('UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - ?) WHERE id = ?', [fItem.quantity, fItem.product_id]);
      }
    }

    // Clear user cart
    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await connection.commit();

    res.status(201).json({
      message: 'Order placed successfully with Cash on Delivery.',
      order: {
        id: orderId,
        orderNumber,
        totalAmount: calculatedTotal,
        paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Order checkout error:', error);
    res.status(500).json({ error: 'Failed to process checkout. Please try again.' });
  } finally {
    connection.release();
  }
});

// GET /api/orders/my-orders - list order history
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query(`
      SELECT o.*,
        (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    // For each order, get order items with product titles and images
    const detailedOrders = await Promise.all(
      orders.map(async (ord) => {
        const [items] = await pool.query(`
          SELECT 
            oi.id AS order_item_id,
            oi.price,
            oi.quantity,
            p.id AS product_id,
            p.title,
            p.slug,
            p.brand,
            p.size,
            p.condition_status,
            p.image_url
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [ord.id]);

        return {
          ...ord,
          shipping_address: typeof ord.shipping_address === 'string' ? JSON.parse(ord.shipping_address) : ord.shipping_address,
          items,
        };
      })
    );

    res.json({ orders: detailedOrders });
  } catch (error) {
    console.error('Fetch my-orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve order history.' });
  }
});

// GET /api/orders/:orderNumber
router.get('/:orderNumber', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.order_number = ? AND (o.user_id = ? OR ? = 'admin')
    `, [req.params.orderNumber, req.user.id, req.user.role]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orders[0];
    order.shipping_address = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;

    const [items] = await pool.query(`
      SELECT 
        oi.id AS order_item_id,
        oi.price,
        oi.quantity,
        p.id AS product_id,
        p.title,
        p.slug,
        p.brand,
        p.size,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id]);

    res.json({ order, items });
  } catch (error) {
    console.error('Fetch order detail error:', error);
    res.status(500).json({ error: 'Failed to retrieve order.' });
  }
});

export default router;
