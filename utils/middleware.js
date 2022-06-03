const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('./logger');

const logs = (request, response, next) => {
  console.log('request');
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid or missing token' });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    response.status(401);
  }

  const user = await User.findById(decodedToken.id);

  if (user) {
    request.user = user;
  }
  next();
};

module.exports = { tokenExtractor, userExtractor, errorHandler, logs };
