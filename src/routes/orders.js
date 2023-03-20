const router = require('express').Router();
const {
  createOrder,
  getProfileOrders,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controllers/orders');
const { authorize, isRole } = require('../middleware/auth');

router.post('/', authorize, createOrder);
router.get('/profile', authorize, getProfileOrders);

router.get('/', authorize, isRole('admin'), getOrders);
router.get('/:id', authorize, isRole('admin'), getOrderById);
router.put('/:id', authorize, isRole('admin'), updateOrder);
router.delete('/:id', authorize, isRole('admin'), deleteOrder);

module.exports = router;
