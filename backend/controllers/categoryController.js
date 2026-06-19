const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;
    
    const category = await Category.create({
      user: req.user._id,
      name,
      type,
      color,
      icon
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
