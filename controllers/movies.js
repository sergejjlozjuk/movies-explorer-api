const { errorsMessage } = require('../constants/errorMessage');
const { BadRequest } = require('../errors/badrequesterror');
const { Forbidden } = require('../errors/forbiddenerror');
const { NotFound } = require('../errors/notfounderror');
const Movies = require('../schemas/movies');

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movies.find({ owner: _id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movies.find({ movieId, owner: req.user._id })
    .then(([movie]) => {
      if (movie === null) {
        return Promise.reject(new NotFound(errorsMessage.notfounderror));
      }
      if (movie.owner._id.toString() !== req.user._id) {
        return Promise.reject(new Forbidden(errorsMessage.forbidenerror));
      }
      return Movies.findOneAndDelete({ movieId });
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(errorsMessage.badrequest));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
