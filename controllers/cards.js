const Card = require('../models/card');
const ApiErrors = require('../utils/apiErrors');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send({ cards });
  } catch (err) {
    next(err);
    return;
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next(ApiErrors.NotFound('Карточка по указанному id не найдена.'));
      return;
    }
    if (!(card.owner == req.user._id)) {
      next(ApiErrors.BadRequest('Переданы некорректные данные'));
      return;
    }
    await Card.findByIdAndRemove(req.params.cardId);
    return res.send(req.params);
  } catch (err) {
    if (err.name === 'CastError') {
      next(ApiErrors.BadRequest('Переданы некорректные данные'));
      return;
    }
    next(err);
    return;
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    next(err);
    return;
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(ApiErrors.NotFound('Карточка по указанному id не найдена.'));
      return;
    }
    return res.send(card);
  } catch (err) {
    next(err);
    return;
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(ApiErrors.NotFound('Карточка по указанному id не найдена.'));
      return;
    }
    return res.send(card);
  } catch (err) {
    next(ApiErrors.Internal(err));
    return;
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
