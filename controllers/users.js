const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { errorsMessage } = require('../constants/errorMessage');
const { successMessage } = require('../constants/successMessage');
const { AuthorizationError } = require('../errors/authorizationerror');
const { BadRequest } = require('../errors/badrequesterror');
const { Conflict } = require('../errors/conflicterror');

const { JWT_SECRET = 'dev' } = process.env;
const User = require('../schemas/users');

const getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => res.send(user))
    .catch(next);
};
const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    _id,
    {
      email,
      name,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(errorsMessage.conflicterror));
      } else {
        next(err);
      }
    });
};
const createUser = (req, res, next) => {
  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        name,
        password: hash,
      })
        .then(() => {
          res.send({ message: successMessage.registration });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new Conflict(errorsMessage.conflicterror));
          } else if (err.name === 'ValidationError') {
            next(
              new BadRequest(errorsMessage.badrequest),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new AuthorizationError(errorsMessage.authorizationerror))
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) {
            Promise.reject(
              new AuthorizationError(errorsMessage.authorizationerror),
            ).catch(next);
          } else {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
              expiresIn: '7d',
            });
            res.cookie('token', token, {
              secure: true,
              httpOnly: true,
              sameSite: 'none',
            });
            res.send({ message: successMessage.authorization });
            res.end();
          }
        })
        .catch(next);
    })
    .catch(next);
};
const signOut = (req, res, next) => {
  res.clearCookie('token', {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });
  res.send({ message: successMessage.deauthorization });
  res.end();
  next();
};
module.exports = {
  getUser,
  login,
  createUser,
  updateUser,
  signOut,
};
