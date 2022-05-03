const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', express.json(), createUser);
router.patch('/me', express.json(), updateUserInfo);
router.patch('/me/avatar', express.json(), updateUserAvatar);

module.exports = router;
