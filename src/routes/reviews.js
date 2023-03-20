const router = require('express').Router();
const {
  getReviews,
  deleteReview,
  getReviewsByCurrentUser,
  createReview,
} = require('../controllers/reviews');
const { authorize, isRole } = require('../middleware/auth');

router.get('/', authorize, isRole('admin'), getReviews);
router.delete('/:id', authorize, isRole('admin'), deleteReview);

router.post('/product/:id', authorize, createReview);
router.get('/user/profile', authorize, getReviewsByCurrentUser);

module.exports = router;
