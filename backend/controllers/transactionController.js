const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('category', 'name color icon type')
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;
    
    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date,
      notes
    });

    const populatedTransaction = await Transaction.findById(transaction._id).populate('category', 'name color icon type');
    
    res.status(201).json(populatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
