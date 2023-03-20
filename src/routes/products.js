const router = require('express').Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');
const { authorize, isRole } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authorize, isRole('admin'), createProduct);
router.put('/:id', authorize, isRole('admin'), updateProduct);
router.delete('/:id', authorize, isRole('admin'), deleteProduct);

module.exports = router;
