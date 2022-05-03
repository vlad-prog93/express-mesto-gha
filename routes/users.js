const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  handleErrors,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', express.json(), createUser);
router.patch('/me', express.json(), updateUserInfo);
router.patch('/me/avatar', express.json(), updateUserAvatar);
router.use(handleErrors);
router.get('me/:some', (req, res) => res.status(404).send({ message: 'Такой страницы нет' }));

module.exports = router;
