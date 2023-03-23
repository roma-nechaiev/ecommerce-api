const debug = require('debug')('app:reviews');
const Product = require('../models/Product');
const Review = require('../models/Review');
const AppError = require('./AppError');

const calculateRating = async (id) => {
  try {
    debug(`Calculating rating for product ${id}`);
    const reviews = await Review.find({ product: id });
    const numReviews = await Review.countDocuments({ product: id });
    const avgRating = reviews.reduce((a, c) => c.rating + a, 0) / reviews.length;
    const product = await Product.findById(id);
    product.rating = avgRating;
    product.numReviews = numReviews;
    await product.save();
  } catch (err) {
    throw new AppError(err);
  }
};

module.exports = calculateRating;
