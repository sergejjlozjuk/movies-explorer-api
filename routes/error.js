const { NotFound } = require('../errors/notfounderror');

const notFoundPage = (req, res, next) => {
  next(new NotFound('Такой страницы не существует!'));
};
module.exports = {
  notFoundPage,
};
