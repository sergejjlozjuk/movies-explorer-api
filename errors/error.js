const { AuthorizationError } = require('./authorizationerror');
const { NotFound } = require('./notfounderror');

const errorhandler = (err, req, res, next) => {
  if (err instanceof NotFound || err instanceof AuthorizationError) {
    res.status(err.status).send(err.message);
  } else {
    console.log(err);
  }
  next();
};

module.exports = {
  errorhandler,
  NotFound,
  AuthorizationError,
};
