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
    res.send({ users });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(ApiErrors.NotFound('Пользователь по указанному id не найден.'));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(ApiErrors.NotFound('Пользователь по указанному id не найден.'));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    if (!email || !password) {
      next(ApiErrors.BadRequest('Неправильные логин или пароль'));
    }
    const hashPassword = await bcrypt.hash(password, SOLT_ROUND);
    let user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      next(ApiErrors.Conflict('Пользователь уже существует'));
    }
    next(err);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const id = req.user._id;
    const user = await
    User.findByIdAndUpdate(id, { name, about }, { runValidators: true, new: true });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const id = req.user._id;
    const user = await User.findByIdAndUpdate(id, { avatar }, { runValidators: true, new: true });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(ApiErrors.Unauthorized('Неправильные логин или пароль'));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    next(ApiErrors.Unauthorized('Неправильные логин или пароль'));
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    next(ApiErrors.Unauthorized('Неправильные логин или пароль'));
  }
  const token = jwt.sign({ user: user._id }, SECRET_KEY, { expiresIn: '7d' });
  res.cookie('jwt', token, {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
  })
    .send({ message: 'Вы успешно авторизованы' });
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
