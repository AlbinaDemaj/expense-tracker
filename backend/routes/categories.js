import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    if (!categories.length) return res.status(404).json({ ok: false, error: 'No categories found' });
    return res.status(200).json({ ok: true, data: categories });
  } catch {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ ok: false, error: 'Name is required' });

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ ok: false, error: 'Category exists' });

    const category = await Category.create({ name: name.trim() });
    return res.status(201).json({ ok: true, data: category });
  } catch {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

export default router;
