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
    res.status(err.status).send(err.message);
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(400).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Ошибка на сервере' });
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
