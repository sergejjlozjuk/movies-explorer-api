const authRouter = require('express').Router();
const { createUser, login, signOut } = require('../controllers/users');

authRouter.post('/signup', createUser);
authRouter.post('/signin', login);
authRouter.post('/signout', signOut);

module.exports = {
  authRouter,
};
