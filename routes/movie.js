const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regex } = require('../constants/regex');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', celebrate({
  body: {
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regex.link),
    trailerLink: Joi.string().required().regex(regex.link),
    thumbnail: Joi.string().required().regex(regex.link),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  },
}), createMovie);
movieRouter.delete('/:movieId', celebrate({
  params: {
    movieId: Joi.string().required(),
  },
}), deleteMovie);

module.exports = {
  movieRouter,
};
