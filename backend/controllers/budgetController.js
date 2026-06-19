const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { user: req.user._id };
    
    if (month && year) {
      query.month = month;
      query.year = year;
    }

    const budgets = await Budget.find(query).populate('category', 'name color icon type');
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    
    // Check if budget already exists for this category/month/year
    let budget = await Budget.findOne({ user: req.user._id, category, month, year });
    
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user._id,
        category,
        amount,
        month,
        year
      });
    }

    const populatedBudget = await Budget.findById(budget._id).populate('category', 'name color icon type');
    res.status(201).json(populatedBudget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
