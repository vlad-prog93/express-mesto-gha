const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const app = express();
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    app.use((req, res, next) => {
      req.user = {
        _id: '626e5df8eff4fbf5dd5f6f69',
      };
      next();
    });

    app.use(cors());
    app.get('/', (req, res) => res.status(404).send({ message: 'Такой страницы нет' }));
    app.use('/users', routerUsers);
    app.use('/cards', routerCards);
    app.get('/:some', (req, res) => res.status(404).send({ message: 'Такой страницы нет' }));

    app.listen(PORT, () => {
      console.log(`Server has been started http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(`Error ${err}`);
  }
};

start();
