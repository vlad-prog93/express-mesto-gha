const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { validationSignIn, validationSignUp } = require('./middlewares/validation');
const ApiErrors = require('./utils/apiErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestoauth', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    app.use(express.json());
    app.use(cookieParser());
    app.use(requestLogger);
    app.post('/signin', validationSignIn, login);
    app.post('/signup', validationSignUp, createUser);
    app.use(auth);
    app.use('/users', routerUsers);
    app.use('/cards', routerCards);
    app.use((req, res, next) => next(ApiErrors.NotFound('Страница не найдена')));
    app.use(errorLogger);
    app.use(errors());
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server has been started http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(`Error ${err}`);
  }
};

start();
