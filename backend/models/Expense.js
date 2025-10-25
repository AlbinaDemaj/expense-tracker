import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: '' },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export default mongoose.model('Expense', expenseSchema);
