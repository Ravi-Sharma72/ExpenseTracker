const express = require('express');
const router = express.Router();
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCategories)
  .post(protect, addCategory);

router.route('/:id')
  .delete(protect, deleteCategory);

module.exports = router;
