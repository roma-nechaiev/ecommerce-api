const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} = require('../controllers/users');
const { authorize, isRole } = require('../middleware/auth');

router.get('/profile', authorize, getUserProfile);
router.put('/profile', authorize, updateUserProfile);
router.post('/password', authorize, updateUserPassword);

router.get('/', authorize, isRole('admin'), getUsers);
router.get('/:id', authorize, isRole('admin'), getUser);
router.put('/:id', authorize, isRole('admin'), updateUser);
router.delete('/:id', authorize, isRole('admin'), deleteUser);

module.exports = router;
