const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [100, 'Name can not be more than 100 characters'],
    trim: true,
  },
  review: {
    type: String,
    required: [true, 'Review is required'],
    maxlength: [500, 'Review can not be more than 500 characters'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    maxlength: [5, 'Rating can not be more than 5 characters'],
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

module.exports = mongoose.model('Review', reviewSchema);
