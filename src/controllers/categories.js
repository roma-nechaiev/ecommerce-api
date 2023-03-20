const Category = require('../models/Category');
const AppError = require('../utils/AppError');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      category,
    });
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const category = await Category.create(req.body);
    res.status(201).json({
      status: 'success',
      category,
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      category,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      throw next(new AppError('Category not found', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'Category deleted',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
