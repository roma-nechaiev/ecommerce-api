const Review = require('../models/Review');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const Filter = require('../utils/Filter');
const calculateRating = require('../utils/calculateRating');

const getReviews = async (req, res, next) => {
  try {
    const count = await Review.countDocuments();
    const filter = new Filter(Review, req.query).searchByKeyword().filter().paginate()
      .sort();
    const reviews = await filter.query;

    res.status(200).json({
      status: 'success',
      count,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      throw next(new AppError('Review not found', 404));
    }

    await calculateRating(review.product);

    res.status(200).json({
      status: 'success',
      message: 'Review removed',
    });
  } catch (err) {
    next(err);
  }
};

const getReviewsByCurrentUser = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

const createReview = async (req, res, next) => {
  try {
    const reviewBody = {
      name: req.body.name,
      review: req.body.review,
      rating: req.body.rating,
    };
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw next(new AppError('Product not found', 404));
    }
    const review = await Review.findOne({ user: req.user.id, product: req.params.id });

    if (review) {
      const reviewUpddate = await Review.findByIdAndUpdate(
        review.id,
        { $set: reviewBody },
        { new: true },
      );
      await calculateRating(req.params.id);

      res.status(200).json({
        status: 'success',
        review: reviewUpddate,
      });
    } else {
      const reviewCreate = await Review.create({
        ...reviewBody,
        user: req.user.id,
        product: req.params.id,
      });
      await calculateRating(req.params.id);

      res.status(201).json({
        status: 'success',
        review: reviewCreate,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getReviews,
  deleteReview,
  getReviewsByCurrentUser,
  createReview,
};
