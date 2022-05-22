const express = require('express');
const {
  validationUpdateUserInfo,
  validationUpdateUserAvatar,
  validationGetUser,
} = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getUserById,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validationGetUser, getUserById);
router.patch('/me', validationUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validationUpdateUserAvatar, updateUserAvatar);

module.exports = router;
