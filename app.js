const cookieParser = require('cookie-parser');
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const { default: mongoose } = require('mongoose');
const { errorhandler } = require('./errors/error');
const { router } = require('./routes');

const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
const {
  PORT = 3000,
  DB_NAME = 'bitfilmsdb',
  DB_CONNECT = 'mongodb://localhost:27017/',
} = process.env;
mongoose.set('strictQuery', false);
mongoose.connect(DB_CONNECT + DB_NAME);

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.use(errorhandler);
app.listen(PORT);
console.log(`server started on port: ${PORT}`);
