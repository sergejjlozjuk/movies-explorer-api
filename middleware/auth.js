const jwt = require('jsonwebtoken');
const { errorsMessage } = require('../constants/errorMessage');
const { AuthorizationError } = require('../errors/authorizationerror');

const { JWT_SECRET = 'dev' } = process.env;

const authorizationHandler = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AuthorizationError(errorsMessage.unauthorizederror));
  }
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizationError(errorsMessage.unauthorizederror));
  }
  req.user = payload;
  return next();
};

module.exports = {
  authorizationHandler,
};
