const jwt = require('jsonwebtoken');
const ApiErrors = require('../utils/apiErrors');
const SECRET_KEY = 'HELLObro';


const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
      req.user = {
        _id: decoded.user
      }
      next();
    } else {
      next(new ApiErrors(403, 'У  вас нет доступа'));
      return;
    }
  }
  catch(err) {
    next(new ApiErrors(403, 'У  вас нет доступа'));
    return;
  }
}

module.exports = auth;