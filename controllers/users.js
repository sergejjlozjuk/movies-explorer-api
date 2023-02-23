const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    .catch(next);
};
const createUser = (req, res, next) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      name,
      password: hash,
    })
      .then(() => {
        res.send('Вы успешно зарегистрировались!');
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new Conflict('Этот пользователь уже зарегистрирован'));
        } else if (err.name === 'ValidationError') {
          next(new BadRequest('Некорректные данные при создание пользователя'));
        } else {
          next(err);
        }
      });
  });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(new AuthorizationError('Неверно введен логин или пароль'))
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) {
            Promise.reject(
              new AuthorizationError('Неверно введен логин или пароль'),
            ).catch(next);
          } else {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
              expiresIn: '7d',
            });
            res.cookie('token', token, {
              secure: false,
              httpOnly: true,
              sameSite: 'none',
            });
            res.send('Авторизация успешна');
            res.end();
          }
        })
        .catch(next);
    })
    .catch(next);
};
const signOut = (req, res, next) => {
  res.clearCookie('token', {
    secure: false,
    httpOnly: true,
    sameSite: 'none',
  });
  res.send('Деавторизация');
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
