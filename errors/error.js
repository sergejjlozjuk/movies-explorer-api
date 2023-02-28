const { errorsMessage } = require('../constants/errorMessage');
const { AuthorizationError } = require('./authorizationerror');
const { BadRequest } = require('./badrequesterror');
const { Conflict } = require('./conflicterror');
const { Forbidden } = require('./forbiddenerror');
const { NotFound } = require('./notfounderror');

const errorhandler = (err, req, res, next) => {
  if (
    err instanceof NotFound
    || err instanceof AuthorizationError
    || err instanceof Forbidden
    || err instanceof BadRequest
    || err instanceof Conflict
  ) {
    res.status(err.status).send({ message: err.message });
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: err.message });
  } else {
    res.status(500).send({ message: errorsMessage.internalerror });
  }
  next();
};

module.exports = {
  errorhandler,
  NotFound,
  AuthorizationError,
  Forbidden,
  BadRequest,
  Conflict,
};
