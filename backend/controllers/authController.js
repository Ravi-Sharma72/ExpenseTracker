const User = require('../models/User');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      // Seed default categories
      const defaultCategories = [
        { user: user._id, name: 'Salary', type: 'income', color: '#10b981' },
        { user: user._id, name: 'Food', type: 'expense', color: '#3b82f6' },
        { user: user._id, name: 'Utilities', type: 'expense', color: '#a855f7' },
        { user: user._id, name: 'Business', type: 'income', color: '#f59e0b' },
        { user: user._id, name: 'Entertainment', type: 'expense', color: '#ec4899' },
        { user: user._id, name: 'Transportation', type: 'expense', color: '#eab308' },
        { user: user._id, name: 'Health', type: 'expense', color: '#ef4444' },
        { user: user._id, name: 'Shopping', type: 'expense', color: '#06b6d4' },
      ];
      await Category.insertMany(defaultCategories);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
