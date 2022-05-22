const express = require('express');
const {
  validationUpdateUserInfo,
  validationUpdateUserAvatar
 } = require('../middlewares/validation')

const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', validationUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validationUpdateUserAvatar, updateUserAvatar);

module.exports = router;
