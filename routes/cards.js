const express = require('express');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
  handleErrors,
} = require('../controllers/cards');

const router = express.Router();

router.delete('/:cardId', deleteCard);
router.get('/', getCards);
router.post('/', express.json(), createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
router.use(handleErrors);
router.get('/:some', (req, res) => res.status(404).send({ message: 'Такой страницы нет' }));
module.exports = router;
