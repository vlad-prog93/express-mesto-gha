const User = require('../models/user');

getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.send({ users })
  } catch (err) {
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    res.send(user)
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(404).send({ 'message': `Пользователь по указанному id: ${req.params.userId} не найден.` })
      return
    }
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body
    const user = await User.create({ name, about, avatar })
    res.send(user)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ 'message': 'Переданы некорректные данные при создании пользователя.' })
      return
    }
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

updateUserInfo = async (req, res) => {
  try {
    const { name, about } = req.body
    if (!name || !about) {
      res.status(400).send({ 'message': 'Переданы некорректные данные при обновлении данных пользователя.' })
      return
    }
    const id = req.user._id
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true })
    res.send(user)
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(404).send({ 'message': `Пользователь по указанному id не найден.` })
      return
    }
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body
    if (!avatar) {
      res.status(400).send({ 'message': 'Переданы некорректные данные при обновлении аватара пользователя.' })
      return
    }
    const id = req.user._id
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true })
    res.send(user)
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(404).send({ 'message': `Пользователь по указанному id не найден.` })
      return
    }
    res.status(500).res.send({ 'message': 'Ошибка по-умолчанию.' })
    return
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar
}