const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');

authRouter.post('/signup', celebrate({
  body: {
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().required(),
  },
}), createUser);
authRouter.post('/signin', celebrate({
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}), login);

module.exports = {
  authRouter,
};
