const router = require('express').Router();
const { signOut } = require('../controllers/users');
const { authorizationHandler } = require('../middleware/auth');
const { authRouter } = require('./auth');
const { notFoundPage } = require('./error');
const { movieRouter } = require('./movie');
const { userRouter } = require('./user');

router.use('/', authRouter);
router.use(authorizationHandler);
router.post('/signout', signOut);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', notFoundPage);

module.exports = {
  router,
};
