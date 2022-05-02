const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: `Пользователь по указанному id: ${req.params.userId} не найден.` });
    }
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return null;
    }
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении данных пользователя.' });
    }
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
    }
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара пользователя.' });
    }
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
    }
    return res.status(500).res.send({ message: 'Ошибка по-умолчанию.' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
