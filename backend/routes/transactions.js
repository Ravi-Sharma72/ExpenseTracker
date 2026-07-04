const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction, updateTransaction, resetTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/reset')
  .delete(protect, resetTransactions);

router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
