const Card = require('../models/card');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send({ cards });
  } catch (err) {
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) return res.status(404).send({ message: 'Карточка по указанному id не найдена.' });
    return res.send(req.params);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    if (!name || !link) return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) return res.status(404).send({ message: 'Карточка по указанному id не найдена.' });
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) return res.status(404).send({ message: 'Карточка по указанному id не найдена.' });
    return res.send(card);
  } catch (err) {
    return next(err);
  }
};

const handleErrors = (err, req, res) => {
  if (err.name === 'CastError' && err.kind === 'ObjectId' && err.value.length !== 22) {
    return res.status(400).send({ message: 'Введен некорректный id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  }
  return res.status(500).send({ message: 'Ошибка по-умолчанию.' });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
  handleErrors,
};
