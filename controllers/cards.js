const Card = require('../models/card');
const ApiErrors = require('../utils/apiErrors');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send({ cards });
  } catch (err) {
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(ApiErrors.NotFound('Карточка по указанному id не найдена.'));
    }
    if (!(card.owner == req.user._id)) {
      return next(new ApiErrors(403, 'Нельзя удалать чужую карточку'));
    }
    await Card.findByIdAndRemove(req.params.cardId);
    return res.send(req.params);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiErrors.BadRequest('Переданы некорректные данные'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return ApiErrors.BadRequest('Переданы некорректные данные');
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
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
      return next(ApiErrors.NotFound('Карточка по указанному id не найдена.'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiErrors.BadRequest('Введен некорректный id'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
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
      return next(ApiErrors.NotFound('Карточка по указанному id не найдена.'));
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiErrors.BadRequest('Введен некорректный id'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
