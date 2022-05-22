const express = require('express');
const {
  validationCreateCard,
  validationChangeStateCard,
} = require('../middlewares/validation');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const router = express.Router();

router.delete('/:cardId', validationChangeStateCard, deleteCard);
router.get('/', getCards);
router.post('/', validationCreateCard, createCard);
router.put('/:cardId/likes', validationChangeStateCard, likeCard);
router.delete('/:cardId/likes', validationChangeStateCard, dislikeCard);

module.exports = router;
