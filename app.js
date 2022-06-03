const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const loginRouter = require('./controllers/login');
const userRouter = require('./controllers/users');
const weatherRouter = require('./controllers/weather');

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) => logger.info('Error connecting to MongoDB', error.message));

app.use(middleware.logs);
app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use('/api/weather', middleware.tokenExtractor);

app.use('/api/weather', weatherRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
