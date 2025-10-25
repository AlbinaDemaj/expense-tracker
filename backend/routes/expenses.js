import express from 'express';
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import { sendBudgetAlert } from '../services/emailService.js';

const router = express.Router();
const BUDGET_LIMIT = Number(process.env.BUDGET_LIMIT || 1000);

async function getTotal() {
  const agg = await Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
  return agg?.[0]?.total || 0;
}

// GET /api
router.get('/', async (_req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    if (!expenses.length) return res.status(404).json({ ok: false, error: 'No expenses found' });
    return res.status(200).json({ ok: true, data: expenses });
  } catch {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// POST /api
router.post('/', async (req, res) => {
  try {
    const { categoryId, amount, description } = req.body;
    if (!categoryId) return res.status(400).json({ ok: false, error: 'categoryId is required' });
    if (amount == null) return res.status(400).json({ ok: false, error: 'amount is required' });

    const parsed = Number(amount);
    if (Number.isNaN(parsed) || parsed < 0) return res.status(400).json({ ok: false, error: 'amount must be positive' });

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ ok: false, error: 'Invalid categoryId' });

    const totalBefore = await getTotal();
    const expense = await Expense.create({ categoryId, amount: parsed, description: description?.trim() || '' });
    const totalAfter = totalBefore + parsed;

    if (totalBefore <= BUDGET_LIMIT && totalAfter > BUDGET_LIMIT) {
      await sendBudgetAlert({ total: totalAfter, limit: BUDGET_LIMIT });
    }

    return res.status(201).json({ ok: true, data: { expense, total: totalAfter } });
  } catch {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// DELETE 
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, error: 'Expense not found' });
    const total = await getTotal();
    return res.status(200).json({ ok: true, data: { deletedId: req.params.id, total } });
  } catch {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// GET /api
router.get('/summary', async (_req, res) => {
  try {
    const byCategory = await Expense.aggregate([
      { $group: { _id: '$categoryId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    const withNames = await Promise.all(
      byCategory.map(async (row) => {
        const cat = await Category.findById(row._id);
        return { categoryId: row._id, categoryName: cat?.name || '(deleted)', total: row.total, count: row.count };
      })
    );

    const overall = await getTotal();
    return res.status(200).json({ ok: true, data: { overall, byCategory: withNames } });
  } catch {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

export default router;
