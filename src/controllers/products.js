const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const Filter = require('../utils/Filter');

const getProducts = async (req, res, next) => {
  try {
    const count = await Product.countDocuments();
    const filter = new Filter(Product, req.query).searchByKeyword().filter().paginate()
      .sort();
    const products = await filter.query;

    res.status(200).json({
      status: 'success',
      count,
      products,
    });
  } catch (err) {
    next(err);
  }
};
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw next(new AppError('Product not found', 404));
    }
    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err) {
    next(err);
  }
};
const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
      status: 'success',
      product,
    });
  } catch (err) {
    next(err);
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw next(new AppError('Product not found', 404));
    }
    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err) {
    next(err);
  }
};
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw next(new AppError('Product not found', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'Product deleted',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
