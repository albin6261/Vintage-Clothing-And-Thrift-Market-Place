import express from 'express';
import { pool } from '../db/db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
}

// GET /api/seller/products - view listings by logged-in seller
router.get('/products', authenticateToken, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    const sellerId = req.user.id;
    const [products] = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.seller_id = ?
      ORDER BY p.created_at DESC
    `, [sellerId]);

    const formatted = products.map(p => ({
      ...p,
      is_one_of_one: Boolean(p.is_one_of_one),
      measurements: typeof p.measurements === 'string' ? JSON.parse(p.measurements) : p.measurements,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    }));

    res.json({ products: formatted });
  } catch (error) {
    console.error('Fetch seller products error:', error);
    res.status(500).json({ error: 'Failed to retrieve your listings.' });
  }
});

// POST /api/seller/products - submit new vintage listing
router.post('/products', authenticateToken, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      title,
      brand,
      era,
      category_id,
      price,
      original_price,
      size,
      condition_status,
      gender = 'unisex',
      description,
      measurements,
      materials,
      color,
      is_one_of_one = true,
      stock_quantity = 1,
      image_url,
      images = [],
      curated_collection,
    } = req.body;

    if (!title || !brand || !era || !category_id || !price || !size || !condition_status || !description || !image_url) {
      return res.status(400).json({ error: 'Please fill in all required product fields and provide an image.' });
    }

    const slug = slugify(title);
    const finalImages = images && images.length > 0 ? images : [image_url];
    // By default, seller listings start as 'pending' for Admin approval, unless submitted by admin
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const [result] = await pool.query(`
      INSERT INTO products (
        title, slug, brand, era, category_id, seller_id, price, original_price,
        size, condition_status, gender, description, measurements, materials, color,
        is_one_of_one, stock_quantity, status, image_url, images, curated_collection
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title.trim(),
      slug,
      brand.trim(),
      era,
      Number(category_id),
      sellerId,
      Number(price),
      original_price ? Number(original_price) : null,
      size.trim(),
      condition_status,
      ['boys', 'girls', 'unisex'].includes(gender) ? gender : 'unisex',
      description.trim(),
      measurements ? JSON.stringify(measurements) : null,
      materials || null,
      color || null,
      is_one_of_one ? 1 : 0,
      is_one_of_one ? 1 : Math.max(1, parseInt(stock_quantity) || 1),
      initialStatus,
      image_url.trim(),
      JSON.stringify(finalImages),
      curated_collection || null,
    ]);

    res.status(201).json({
      message: initialStatus === 'approved' 
        ? 'Listing published successfully!' 
        : 'Listing submitted for curation approval. Our team will review it shortly.',
      product: {
        id: result.insertId,
        title,
        slug,
        status: initialStatus,
      },
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create vintage listing.' });
  }
});

// DELETE /api/seller/products/:id
router.delete('/products/:id', authenticateToken, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;

    const [prod] = await pool.query('SELECT seller_id FROM products WHERE id = ?', [productId]);
    if (prod.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (prod[0].seller_id !== sellerId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this listing.' });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [productId]);
    res.json({ message: 'Listing removed successfully.' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

export default router;
