const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  magaca: { type: String, required: true },
  lacag: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  taariikh: { type: Date, required: true },
  description: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
