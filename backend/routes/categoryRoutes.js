import express from 'express';
import { pool } from '../db/db.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status = 'approved') AS active_count
      FROM categories c
      ORDER BY c.id ASC
    `);

    res.json({ categories });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json({ category: categories[0] });
  } catch (error) {
    console.error('Category error:', error);
    res.status(500).json({ error: 'Failed to retrieve category.' });
  }
});

export default router;
