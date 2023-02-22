const router = require('express').Router();
const { authorizationHandler } = require('../middleware/auth');
const { authRouter } = require('./auth');
const { movieRouter } = require('./movie');
const { userRouter } = require('./user');

router.use('/', authRouter);
router.use(authorizationHandler);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = {
  router,
};
