const express = require('express');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const router = express.Router();

router.delete('/:cardId', deleteCard);
router.get('/', getCards);
router.post('/', express.json(), createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
