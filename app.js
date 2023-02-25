require('dotenv').config();
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const { default: helmet } = require('helmet');
const { default: mongoose } = require('mongoose');
const { PORT, DB_CONNECT, DB_NAME } = require('./constants/connectConfig');
const { errorhandler } = require('./errors/error');
const { checkSource } = require('./middleware/cors');
const { limiter } = require('./middleware/limiter');
const { errorLogger, requestLogger } = require('./middleware/logger');
const { router } = require('./routes');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(DB_CONNECT + DB_NAME);

app.use(helmet());
app.use(requestLogger);
app.use(checkSource);
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(errorhandler);
app.listen(PORT);
