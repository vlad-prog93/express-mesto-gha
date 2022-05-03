const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    return next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении данных пользователя.' });
    }
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true });
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара пользователя.' });
    }
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { new: true });
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const handleErrors = (err, req, res, next) => {
  if (err.name === 'CastError' && err.kind === 'ObjectId' && err.value.length !== 22) {
    return res.status(400).send({ message: 'Введен некорректный id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  }
  if (!err) {
    return next();
  }
  return res.status(500).send({ message: 'Ошибка по-умолчанию.' });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  handleErrors,
};
