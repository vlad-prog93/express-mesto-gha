const Card = require('../models/card');
const ApiErrors = require('../utils/apiErrors');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ cards });
    return;
  } catch (err) {
    next(err);
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
      next(new ApiErrors(403, 'Нельзя удалать чужую карточку'));
      return;
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.send(req.params);
    return;
  } catch (err) {
    if (err.name === 'CastError') {
      next(ApiErrors.BadRequest('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
    return;
  } catch (err) {
    next(err);
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
    res.send(card);
    return;
  } catch (err) {
    next(err);
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
    res.send(card);
    return;
  } catch (err) {
    next(ApiErrors.Internal(err));
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
