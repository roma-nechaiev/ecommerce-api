const router = require('express').Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories');
const { authorize, isRole } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', authorize, isRole('admin'), createCategory);
router.put('/:id', authorize, isRole('admin'), updateCategory);
router.delete('/:id', authorize, isRole('admin'), deleteCategory);

module.exports = router;
