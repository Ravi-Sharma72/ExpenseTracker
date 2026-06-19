const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
