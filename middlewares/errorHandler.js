const ApiErrors = require("../utils/apiErrors");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiErrors) {
    res.status(err.code).send({ message: err.message });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Введен некорректный id'});
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные'});
    return;
  }

  res.status(500).send({ message: 'Ошибка по-умолчанию.'});
  return;
}

module.exports = errorHandler