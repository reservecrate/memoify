const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const memosRouter = require('./controllers/memos');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const morgan = require('morgan');
const {
  userExtractor,
  unknownEndpoint,
  errorHandler
} = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(err => {
    logger.info('error connecting to MongoDB:', err.message);
  });

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/memos', userExtractor, memosRouter);
app.use('/api/users', userExtractor, usersRouter);
app.use('/api/login', loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
