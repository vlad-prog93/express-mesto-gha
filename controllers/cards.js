const Card = require('../models/card');

getCards = async (req, res) => {
  try {
    const cards = await Card.find({})
    res.send({ cards })
  } catch (err) {
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId)
    res.send(req.params)
  } catch (err) {
    if (err.name == 'CastError') {
      res.status(404).send({ 'message': `Карточка с указанным id: ${req.params.cardId} не найдена.` })
      return
    }
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }

}

createCard = async (req, res) => {
  try {
    const { name, link } = req.body
    const owner = req.user._id
    const card = await Card.create({ name, link, owner })
    res.send(card)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ 'message': 'Переданы некорректные данные при создании карточки.' })
      return
    }
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true })
    if (!card) {
      res.status(404).send({ 'message': `Передан несуществующий id карточки.` })
      return
    }
    res.send(card)
  } catch (err) {
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true })
    if (!card) {
      res.status(404).send({ 'message': `Передан несуществующий id карточки.` })
      return
    }
    res.send(card)
  } catch (err) {
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard
}