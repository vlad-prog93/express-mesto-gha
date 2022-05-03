const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    return res.status(500).send({ message: 'Ошибка по-умолчанию.' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError' && err.value.length !== 22) {
      return res.status(400).send({ message: 'Введен некорректный id' });
    }
    return res.status(500).send({ message: 'Ошибка по-умолчанию.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar }, { runValidators: true });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    }
    return res.status(500).send({ message: 'Ошибка по-умолчанию.' });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { name, about } = req.body;
    const id = req.user._id;
    const user = await
    User.findByIdAndUpdate(id, { name, about }, { runValidators: true, new: true });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Введен некорректный id' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении данных пользователя.' });
    }
    return res.status(500).send({ message: 'Ошибка по-умолчанию.' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { runValidators: true, new: true });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Введен некорректный id' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара пользователя.' });
    }
    return res.status(500).send({ message: 'Ошибка по-умолчанию.' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
