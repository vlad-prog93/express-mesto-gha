const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const { validationSignIn, validationSignUp }  = require('./middlewares/validation');

const app = express();
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestoauth', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
    app.use(express.json());

    app.post('/signin', validationSignIn, login);
    app.post('/signup', validationSignUp, createUser);
    app.use(auth);
    app.use('/users', routerUsers);
    app.use('/cards', routerCards);
    app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

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
