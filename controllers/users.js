const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiErrors = require('../utils/apiErrors');

const DUBLICATE_MONGOOSE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;
const SECRET_KEY = 'HELLObro';

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send({ ...users });
  } catch (err) {
    return next(ApiErrors.Internal('Ошибка по-умолчанию.'));
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(ApiErrors.NotFound('Пользователь по указанному id не найден.'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiErrors.BadRequest('Введен некорректный id'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(ApiErrors.NotFound('Пользователь по указанному id не найден.'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiErrors.BadRequest('Введен некорректный id'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, SOLT_ROUND);
    let user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    user = user.toObject();
    delete user.password;
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(ApiErrors.BadRequest('Переданы некорректные данные при создании пользователя.'));
    }
    if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      return next(ApiErrors.Conflict('Пользователь уже существует'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const id = req.user._id;
    const user = await
    User.findByIdAndUpdate(id, { name, about }, { runValidators: true, new: true });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiErrors.BadRequest('Введен некорректный id'));
    }
    if (err.name === 'ValidationError') {
      return next(ApiErrors.BadRequest('Переданы некорректные данные при обновлении данных пользователя.'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { runValidators: true, new: true });
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(ApiErrors.BadRequest('Введен некорректный id'));
    }
    if (err.name === 'ValidationError') {
      return next(ApiErrors.BadRequest('Переданы некорректные данные при обновлении аватара пользователя.'));
    }
    return next(ApiErrors.Internal('Ошибка по-умолчанию'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(ApiErrors.BadRequest('Неправильные логин или пароль'));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(ApiErrors.Unauthorized('Неправильные логин или пароль'));
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(ApiErrors.Unauthorized('Неправильные логин или пароль'));
  }
  const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
  return res.send({ token });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getUserById,
};
