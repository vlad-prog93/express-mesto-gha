const errorHandler = (err, req, res, next) => {
  const statusCode = err.code || 500;

  const message = statusCode === 500 ? 'Ошибка по-умолчанию.': err.message
  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
