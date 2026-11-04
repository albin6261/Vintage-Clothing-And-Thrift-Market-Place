import express from 'express';
import { pool } from '../db/db.js';

const router = express.Router();

// GET /api/products - list and filter products
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      era,
      condition,
      minPrice,
      maxPrice,
      gender,
      collection,
      featured,
      newArrivals,
      sort = 'newest',
      page = 1,
      limit = 24,
    } = req.query;

    let query = `
      SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        u.name AS seller_name,
        u.avatar_url AS seller_avatar
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.status = 'approved'
    `;

    const params = [];

    if (search) {
      query += ` AND (p.title LIKE ? OR p.brand LIKE ? OR p.description LIKE ? OR p.curated_collection LIKE ?)`;
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    if (gender && gender !== 'all') {
      if (gender === 'boys') {
        query += ` AND (p.gender = 'boys' OR p.gender = 'unisex')`;
      } else if (gender === 'girls') {
        query += ` AND (p.gender = 'girls' OR p.gender = 'unisex')`;
      } else {
        query += ` AND p.gender = ?`;
        params.push(gender);
      }
    }

    if (category && category !== 'all') {
      query += ` AND (c.slug = ? OR c.name = ?)`;
      params.push(category, category);
    }

    if (era && era !== 'all') {
      query += ` AND p.era = ?`;
      params.push(era);
    }

    if (condition && condition !== 'all') {
      query += ` AND p.condition_status = ?`;
      params.push(condition);
    }

    if (collection && collection !== 'all') {
      query += ` AND p.curated_collection = ?`;
      params.push(collection);
    }

    if (featured === 'true' || featured === true) {
      query += ` AND p.featured = 1`;
    }

    if (newArrivals === 'true' || newArrivals === true) {
      query += ` AND p.is_new_arrival = 1`;
    }

    if (minPrice) {
      query += ` AND p.price >= ?`;
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(Number(maxPrice));
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'price-desc':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'featured':
        query += ` ORDER BY p.featured DESC, p.created_at DESC`;
        break;
      case 'newest':
      default:
        query += ` ORDER BY p.is_new_arrival DESC, p.created_at DESC`;
        break;
    }

    // Count query for total
    const countSql = `SELECT COUNT(*) as total FROM (${query}) AS total_subquery`;
    const [countRows] = await pool.query(countSql, params);
    const total = countRows[0]?.total || 0;

    // Pagination
    const numLimit = Math.max(1, parseInt(limit) || 24);
    const numPage = Math.max(1, parseInt(page) || 1);
    const offset = (numPage - 1) * numLimit;

    query += ` LIMIT ? OFFSET ?`;
    params.push(numLimit, offset);

    const [products] = await pool.query(query, params);

    // Format JSON fields
    const parsedProducts = products.map(p => ({
      ...p,
      is_one_of_one: Boolean(p.is_one_of_one),
      featured: Boolean(p.featured),
      is_new_arrival: Boolean(p.is_new_arrival),
      measurements: typeof p.measurements === 'string' ? JSON.parse(p.measurements) : p.measurements,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    }));

    res.json({
      products: parsedProducts,
      pagination: {
        total,
        page: numPage,
        limit: numLimit,
        totalPages: Math.ceil(total / numLimit),
      },
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
});

// GET /api/products/collections - list curated collections
router.get('/curated/collections', async (req, res) => {
  try {
    const [collections] = await pool.query(`
      SELECT 
        curated_collection AS name,
        COUNT(*) AS item_count,
        MIN(image_url) AS cover_image
      FROM products
      WHERE status = 'approved' AND curated_collection IS NOT NULL
      GROUP BY curated_collection
      ORDER BY item_count DESC
    `);
    res.json({ collections });
  } catch (error) {
    console.error('Collections error:', error);
    res.status(500).json({ error: 'Failed to retrieve collections.' });
  }
});

// GET /api/products/:slugOrId - single product details
router.get('/:slugOrId', async (req, res) => {
  try {
    const identifier = req.params.slugOrId;
    const isNumeric = /^\d+$/.test(identifier);

    const query = `
      SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        u.name AS seller_name,
        u.email AS seller_email,
        u.avatar_url AS seller_avatar,
        u.bio AS seller_bio
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
    `;

    const [rows] = await pool.query(query, [identifier]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = rows[0];
    product.is_one_of_one = Boolean(product.is_one_of_one);
    product.featured = Boolean(product.featured);
    product.is_new_arrival = Boolean(product.is_new_arrival);
    product.measurements = typeof product.measurements === 'string' ? JSON.parse(product.measurements) : product.measurements;
    product.images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;

    // Get reviews
    const [reviews] = await pool.query(`
      SELECT r.*, u.name AS user_name, u.avatar_url AS user_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [product.id]);

    // Get related products from same category or collection
    const [related] = await pool.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'approved' AND p.id != ? AND (p.category_id = ? OR p.curated_collection = ?)
      ORDER BY RAND()
      LIMIT 4
    `, [product.id, product.category_id, product.curated_collection]);

    const parsedRelated = related.map(r => ({
      ...r,
      is_one_of_one: Boolean(r.is_one_of_one),
      measurements: typeof r.measurements === 'string' ? JSON.parse(r.measurements) : r.measurements,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images,
    }));

    res.json({
      product,
      reviews,
      related: parsedRelated,
    });
  } catch (error) {
    console.error('Product details error:', error);
    res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
});

export default router;
