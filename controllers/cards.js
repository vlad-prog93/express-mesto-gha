const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send({ cards });
  } catch (err) {
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndRemove(req.params.cardId);
    return res.send(req.params);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: `Карточка с указанным id: ${req.params.cardId} не найдена.` });
    }
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
    }
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий id карточки.' });
    }
    return res.send(card);
  } catch (err) {
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(404).send({ message: 'Передан несуществующий id карточки.' });
    }
    return res.send(card);
  } catch (err) {
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
