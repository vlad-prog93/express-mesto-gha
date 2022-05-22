const jwt = require('jsonwebtoken');
const ApiErrors = require('../utils/apiErrors');

const SECRET_KEY = 'HELLObro';
const auth = async (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(' ')[1];
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
      req.user = {
        _id: decoded.user,
      };
      next();
    } else {
      next(ApiErrors.Unauthorized('У  вас нет доступа'));
    }
  } catch (err) {
    next(ApiErrors.Unauthorized('У  вас нет доступа'));
  }
};

module.exports = auth;
