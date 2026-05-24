const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  magaca: { type: String, required: true },
  number: { type: String },
  lacag: { type: Number, required: true },
  taariikh: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Salary', salarySchema);
