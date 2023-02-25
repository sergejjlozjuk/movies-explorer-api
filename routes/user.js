const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, updateUser } = require('../controllers/users');

userRouter.get('/me', getUser);
userRouter.patch('/me', celebrate({
  body: {
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  },
}), updateUser);

module.exports = {
  userRouter,
};
